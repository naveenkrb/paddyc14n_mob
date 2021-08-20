/* eslint-disable no-underscore-dangle */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, LOCALE_ID, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { StorageKeys } from 'src/app/common/storage-keys';
import { AdminDataService } from 'src/app/services/admin-data.service';
import { CharacterService } from 'src/app/services/character.service';
import { CropService } from 'src/app/services/crop.service';
import { DataSynchronizeService, DataSyncStatus } from 'src/app/services/data-synchronize.service';
import { ReferenceDataService } from 'src/app/services/reference-data.service';
import { SeasonService } from 'src/app/services/season.service';

@Component({
  selector: 'app-synchronize-data',
  templateUrl: './synchronize-data.page.html',
  styleUrls: ['./synchronize-data.page.scss'],
})
export class SynchronizeDataPage implements OnInit, OnDestroy, DoCheck {
  public dataSyncStatus: DataSyncStatus[];
  private _dataSyncStatusSubscription: Subscription;

  constructor(
    private adminDataService: AdminDataService,
    private seasonService: SeasonService,
    private cropService: CropService,
    private characterService: CharacterService,
    private referenceDataService: ReferenceDataService,
    private dataSyncService: DataSynchronizeService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this._dataSyncStatusSubscription = this.dataSyncService.dataSyncStatus
      .subscribe(data => {
        this.dataSyncStatus = data;
      });
    this.synchronizeAdminData();
  }

  ngDoCheck() {
    this.dataSyncService.updateDataSynchStatus();
  }

  ngOnDestroy() {
    this._dataSyncStatusSubscription.unsubscribe();
  }

  trackByDataKey(index: number, status: DataSyncStatus) {
    return status.dataKey;
  }

  getLastSynchronized(status: DataSyncStatus) {
    if (status.lastSynchronized) {
      if (status.lastSynchronized instanceof Date) {
        return Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
          hour12: false,
        }).format(status.lastSynchronized);
      } else {
        return status.lastSynchronized;
      }
    } else {
      return 'Never';
    }
  }

  synchronizeData(slider: IonItemSliding, dataKey: StorageKeys) {
    slider.close();
    console.log('calling sync data for ' + dataKey);
    this.loadingController.create({
      message: 'Synchronizing ' + dataKey + ' ...',
      spinner: 'crescent',
      keyboardClose: true,
    }).then(le => {
      le.present().then(() => {
        let observable: Observable<any> = null;
        switch (dataKey) {
          case StorageKeys.seasons:
            observable = this.seasonService.synchronizeSeasonData();
            break;
          case StorageKeys.crops:
            observable = this.cropService.synchronizeCropData();
            break;
          case StorageKeys.characters:
            observable = this.characterService.synchronizeCharacterData();
            break;
          case StorageKeys.referenceData:
            observable = this.referenceDataService.synchronizeReferenceData();
            break;
        }
        observable
          .subscribe(
            () => {
              le.dismiss();
              this.dataSyncService.updateDataSynchStatus();
            },
            error => {
              le.dismiss();
              console.log(error);
              if (error instanceof HttpErrorResponse) {
                this.showAlert((error as HttpErrorResponse).error);
              } else {
                this.showAlert('Technical Error');
              }
            });
      });
    });
  }

  private synchronizeAdminData() {
    this.loadingController.create({
      message: 'Synchronizing data ...',
      spinner: 'crescent',
      keyboardClose: true,
    }).then(le => {
      le.present().then(() => {
        this.adminDataService.synchronizeAdminData()
          .subscribe(
            () => {
              le.dismiss();
              this.dataSyncService.updateDataSynchStatus();
            },
            error => {
              le.dismiss();
              console.log(error);
              if (error instanceof HttpErrorResponse) {
                this.showAlert((error as HttpErrorResponse).error);
              } else {
                this.showAlert('Technical Error');
              }
            });
      });
    });
  }

  private showAlert(_message: string) {
    this.alertController.create({
      header: 'Data Synch failed',
      message: _message,
      buttons: ['Ok'],
      keyboardClose: true,
    }).then(ae => ae.present());
  }
}
