import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, empty, of } from 'rxjs';
import { catchError, count, reduce, tap } from 'rxjs/operators';
import { ServiceUrl } from '../common/service-url';
import { StorageKeys } from '../common/storage-keys';
import { CharacterData, CharacterService } from './character.service';
import { CropData, CropService } from './crop.service';
import { ReferenceDataData, ReferenceDataService } from './reference-data.service';
import { SeasonData, SeasonService } from './season.service';
import { ServiceBase } from './service-base';

interface AdminData {
  type: StorageKeys;
  data: SeasonData[] | CropData[] | CharacterData[] | ReferenceDataData[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService extends ServiceBase {

  constructor(
    private http: HttpClient,
    private seasonService: SeasonService,
    private cropService: CropService,
    private characterService: CharacterService,
    private refDataService: ReferenceDataService
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
            throw error;
          }),
        tap(
          data => {
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
          })
      );
  }

  private getDataOfType(data: AdminData[], type: StorageKeys) {
    return data.find(d => d.type === type).data;
  }
}
