/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ServiceUrl } from '../common/service-url';
import { StorageKeys } from '../common/storage-keys';
import { ReferenceData } from '../data/reference-data';
import { StorageService } from './storage.service';
import { ServiceBase } from './service-base';
import { tap } from 'rxjs/operators';
import { HttpProvider } from '../common/http-provider';

export interface ReferenceDataData {
  id: number;
  type: string;
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService extends ServiceBase {
  private _referenceData: ReferenceData[];
  private _isLoaded = false;

  constructor(
    private http: HttpProvider,
    private storageService: StorageService) {
    super();
    this._referenceData = [];
  }

  initializeData(data: ReferenceDataData[] = null) {
    if (data != null) {
      this._referenceData = [];
      data.forEach(d => this._referenceData.push(this.getRefDataFromData(d)));
      this.storeReferenceData();
    } else {
      const cached = this.storageService.get(StorageKeys.referenceData);
      if (cached) {
        this._referenceData = cached;
      } else {
        console.log('No reference data in cache');
      }
    }
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get states() {
    return this.getDataForType('STATE');
  }

  get characterStages() {
    return this.getDataForType('CHARACTER_STAGE');
  }

  get landTypes() {
    return this.getDataForType('LAND_TYPE');
  }

  getLandTypeDesc(key: string) {
    return this.landTypes.find(([k, v]) => k === key)[0];
  }

  synchronizeReferenceData() {
    return this.http
      .get<ReferenceDataData[]>(this.getServiceUrl(ServiceUrl.referenceData))
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

  private getDataForType(type: string) {
    return this._referenceData.filter(v => v.type === type).map(v => [v.key, v.value]);
  }

  private getRefDataFromData(data: ReferenceDataData) {
    const refData = new ReferenceData();
    refData.id = data.id;
    refData.type = data.type;
    refData.key = data.key;
    refData.value = data.value;
    return refData;
  }

  private storeReferenceData() {
    this.storageService.set(StorageKeys.referenceData, this._referenceData);
  }
}
