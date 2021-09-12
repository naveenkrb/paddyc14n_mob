/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ServiceUrl } from '../common/service-url';
import { StorageKeys } from '../common/storage-keys';
import { CropObservations } from '../data//crop-observations';
import { Observation } from '../data/observation';
import { StorageService } from './storage.service';
import { CropService } from './crop.service';
import { ServiceBase } from './service-base';
import { FieldError } from '../common/field-error';
import { PlanningService } from './planning.service';
import { ServiceResponse } from '../data/service-response';
import { catchError, map, switchMap, take, tap, timeout } from 'rxjs/operators';
import { HttpProvider } from '../common/http-provider';
import { LoadingController } from '@ionic/angular';

export interface ObservationData {
  observationId?: number;
  planId: number;
  location: string;
  seasonCode: string;
  cropId: number;
  characterId: number;
  observation: string;
  observationImage?: string;
  observationImageMimeType?: string;
  remarks?: string;
  recordedAt?: number;
  wipId?: string;
}

interface ObservationResponseData {
  observationId: number;
  wipId: string;
  errors?: FieldError[];
}

interface ObservationImageData {
  mimeType: string;
  base64Image: string;
}
@Injectable({
  providedIn: 'root'
})
export class ObservationsService extends ServiceBase {
  private _observations: CropObservations[];

  constructor(
    private cropService: CropService,
    private planningService: PlanningService,
    private http: HttpProvider,
    private storageService: StorageService,
    private loadingController: LoadingController
  ) {
    super();
    this._observations = [];
  }

  initializeData(data: ObservationData[] = null) {
    if (data != null) {
      this._observations = [];
      data.forEach(d => {
        const index = this.findObservationsIndex(+d.planId, +d.cropId, true);
        this._observations[index].addObservation(this.getObservationFromData(d));
      });
      this.storeObservations();
    } else {
      const cached = this.storageService.get(StorageKeys.observations);
      if (cached) {
        this._observations = cached;
      } else {
        console.log('No observations in cache');
      }
    }
  }
  getObservationsByIndex(index: number) {
    return this._observations[index];
  }

  setObservationsByIndex(index: number, observations: CropObservations) {
    this._observations[index] = observations;
  }

  addObservationToIndex(index: number, observation: Observation) {
    this._observations[index].addObservation(observation);
    return this.saveObservations();
  }

  findObservationsByPlanAndCrop(planId: number, cropId: number) {
    return this._observations.find(o =>
      o.planId === planId &&
      o.crop.cropId === cropId
    );
  }

  findObservations(planId: number, cropId: number, checkPlansToSave = false) {
    return this._observations.find(o =>
      o.planId === planId &&
      o.crop.cropId === cropId
    );
  }

  findObservationsIndex(planId: number, cropId: number, createIfNotFound = false) {
    let index = this._observations.findIndex(o =>
      o.planId === planId &&
      o.crop.cropId === cropId
    );

    if (createIfNotFound && index === -1) {
      const plan = this.planningService.findPlanById(planId);
      index = this._observations.push(new CropObservations(planId,
        plan.location,
        plan.season,
        this.cropService.find(cropId))) - 1;
    }

    return index;
  }

  storeObservations() {
    this.storageService.set(StorageKeys.observations, this._observations);
  }

  fetchObservations(planId: number, cropId: number, characterId: number) {
    const url = this.getServiceUrl(ServiceUrl.observationData)
      + '/' + planId + '/' + cropId + '/' + characterId;
    return this.http.get<ObservationData[]>(
      url
    ).pipe(
      catchError(error => {
        throw error;
      }),
      map(response => (response as ObservationData[]).map(d => this.getObservationFromData(d)))
    );
  }

  getObservationImageUrl(observation: Observation) {
    const url = this.getServiceUrl(ServiceUrl.observationImage) + '/' + observation.observationId;
    console.log('src url = ' + url);
    const imageUrl = this.http.getImageUrl(url);
    console.log('target url = ' + imageUrl);
    return imageUrl;
  }

  synchronizeObservationData() {
    return this.http
      .get<ObservationData[]>(this.getServiceUrl(ServiceUrl.latestObservationData))
      .pipe(
        tap(
          data => this.initializeData(data),
          error => {
            this.initializeData();
            throw error;
          }
        )
      );
  }

  private getObservationFromData(data: ObservationData) {
    const observation = new Observation();
    observation.observationId = +data.observationId;
    observation.planId = +data.planId;
    observation.characterId = +data.characterId;
    observation.observation = data.observation;
    observation.observationImage = data.observationImage;
    observation.observationImageMimeType = data.observationImageMimeType;
    observation.remarks = data.remarks;
    observation.recordedAt = new Date(data.recordedAt * 1000);

    return observation;
  }

  private getDataFromObservation(
    cropObservation: CropObservations,
    observation: Observation): ObservationData {
    return {
      wipId: observation.wipId,
      planId: cropObservation.planId,
      location: cropObservation.location,
      seasonCode: cropObservation.season.seasonCode,
      cropId: cropObservation.crop.cropId,
      characterId: observation.characterId,
      observation: observation.observation,
      observationImage: observation.observationImage,
      observationImageMimeType: observation.observationImageMimeType,
      remarks: observation.remarks,
      recordedAt: Math.floor(observation.recordedAt.getTime() / 1000.0)
    };
  }

  private saveObservations() {
    const observationsTosave = this._observations
      .reduce<ObservationData[]>(
        (a, c, i) => a.concat(c.observations
          .filter(o => o.wipId?.length > 0)
          .map(o => this.getDataFromObservation(c, o)))
        , []);

    return this.http
      .post<ServiceResponse<ObservationResponseData[]>>(this.getServiceUrl(ServiceUrl.saveObservation),
        observationsTosave)
      .pipe(
        catchError(error => {
          throw error;
        }),
        tap(response => {
          if (this.hasNoError(response)) {
            response.appData.forEach(p => {
              if (p.errors && p.errors.length > 0) {
                console.log(p.wipId + ', ' + p.errors);
              } else {
                const mainIndex = this._observations.findIndex(os => os.observations.findIndex(o => o.wipId && o.wipId === p.wipId) !== -1);
                const index = this._observations[mainIndex].observations.findIndex(o => o.wipId && o.wipId === p.wipId);
                if (mainIndex !== -1 && index !== -1) {
                  const observation = this._observations[mainIndex].observations[index];
                  observation.observationId = p.observationId;
                  observation.wipId = null;
                  this._observations[mainIndex].observations[index] = observation;
                } else {
                  console.log('Invalid observation ,' + p.wipId);
                }
              }
            });
            this.storeObservations();
          }
        })
      );
  }
}
