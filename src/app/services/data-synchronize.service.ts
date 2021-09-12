/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageKeys } from '../common/storage-keys';
import { StorageService } from './storage.service';

export interface DataSyncStatus {
  dataName: string;
  dataKey: StorageKeys;
  lastSynchronized?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataSynchronizeService {
  private _dataSyncItems: DataSyncStatus[] = [
    { dataName: 'Seasons', dataKey: StorageKeys.seasons },
    { dataName: 'Crops', dataKey: StorageKeys.crops },
    { dataName: 'Characters', dataKey: StorageKeys.characters },
    { dataName: 'Reference Data', dataKey: StorageKeys.referenceData },
    { dataName: 'Plans', dataKey: StorageKeys.plans },
    { dataName: 'Latest Observations', dataKey: StorageKeys.observations },
  ];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataSyncStatus = new BehaviorSubject<DataSyncStatus[]>([...this._dataSyncItems]);

  constructor(
    private storageService: StorageService,
  ) { }

  updateDataSynchStatus() {
    const status = [... this._dataSyncItems];
    for (let index = 0; index < status.length; index++) {
      const element = status[index];
      element.lastSynchronized = this.storageService.getAge(element.dataKey);
      status[index] = element;
    }

    this.dataSyncStatus.next(status);
  }
}
