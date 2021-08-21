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
import { catchError, tap } from 'rxjs/operators';
import { HttpProvider } from '../common/http-provider';

interface ObservationData {
  observationId?: number;
  planId: number;
  location: string;
  seasonCode: string;
  cropId: number;
  characterId: number;
  observation: string;
  observationImage: string;
  observationImageMimeType: string;
  remarks?: string;
  recordedAt?: number;
  wipId?: string;
}

interface ObservationResponseData {
  observationId: number;
  wipId: string;
  errors?: FieldError[];
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
    private storageService: StorageService) {
    super();
    this._observations = [];
    this.fetchObservations();
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
      o.planId &&
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

  private getObservationFromData(data: ObservationData) {
    const observation = new Observation();
    observation.observationId = +data.observationId;
    observation.planId = +data.planId;
    observation.characterId = +data.characterId;
    observation.observation = data.observation;
    observation.observationImage = data.observationImage;
    observation.observationImageMimeType = data.observationImageMimeType;
    observation.remarks = data.remarks;
    observation.recordedAt = new Date(data.recordedAt);

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
      recordedAt: observation.recordedAt.valueOf() / 1000
    };
  }

  private fetchObservations() {
    this.http
      .get<ObservationData[]>(this.getServiceUrl(ServiceUrl.observationData))
      .subscribe(
        data => this.initializeData(data),
        error => {
          console.log(error);
          this.initializeData();
        });
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
