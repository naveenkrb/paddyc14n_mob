import { Injectable } from '@angular/core';
import { catchError, count, reduce, tap } from 'rxjs/operators';
import { HttpProvider } from '../common/http-provider';
import { ServiceUrl } from '../common/service-url';
import { StorageKeys } from '../common/storage-keys';
import { CharacterData, CharacterService } from './character.service';
import { CropData, CropService } from './crop.service';
import { ObservationData, ObservationsService } from './observations.service';
import { PlanData, PlanningService } from './planning.service';
import { ReferenceDataData, ReferenceDataService } from './reference-data.service';
import { SeasonData, SeasonService } from './season.service';
import { ServiceBase } from './service-base';

interface AdminData {
  type: StorageKeys;
  data: SeasonData[] | CropData[] | CharacterData[] | ReferenceDataData[] | PlanData[] | ObservationData[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService extends ServiceBase {

  constructor(
    private http: HttpProvider,
    private seasonService: SeasonService,
    private cropService: CropService,
    private characterService: CharacterService,
    private refDataService: ReferenceDataService,
    private planningService: PlanningService,
    private observationService: ObservationsService
  ) {
    super();
  }

  synchronizeAdminData() {
    return this.http.get<AdminData[]>(this.getServiceUrl(ServiceUrl.adminData))
      .pipe(
        catchError(
          error => {
            this.refDataService.initializeData();
            this.seasonService.initializeData();
            this.cropService.initializeData();
            this.characterService.initializeData();
            this.planningService.initializeData();
            this.observationService.initializeData();
            throw error;
          }),
        tap(
          data => {
            // Need to initialize ref data service before others
            this.refDataService.initializeData(
              this.getDataOfType(data, StorageKeys.referenceData) as ReferenceDataData[]);

            data.forEach(
              d => {
                switch (d.type) {
                  case StorageKeys.seasons:
                    this.seasonService.initializeData(d.data as SeasonData[]);
                    break;
                  case StorageKeys.crops:
                    this.cropService.initializeData(d.data as CropData[]);
                    break;
                  case StorageKeys.characters:
                    this.characterService.initializeData(d.data as CharacterData[]);
                    break;
                }
              });

            // Initialize after Admin data is initialized
            data.forEach(
              d => {
                switch (d.type) {
                  case StorageKeys.plans:
                    this.planningService.initializeData(d.data as PlanData[]);
                    break;
                  case StorageKeys.observations:
                    this.observationService.initializeData(d.data as ObservationData[]);
                    break;
                }
              });

          })
      );
  }

  private getDataOfType(data: AdminData[], type: StorageKeys) {
    return data.find(d => d.type === type).data;
  }
}
