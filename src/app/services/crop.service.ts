/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ReferenceDataService } from './reference-data.service';
import { ServiceBase } from './service-base';
import { Crop } from '../data/crop';
import { ServiceUrl } from '../common/service-url';
import { StorageService } from './storage.service';
import { StorageKeys } from '../common/storage-keys';
import { tap } from 'rxjs/operators';
import { HttpProvider } from '../common/http-provider';

export interface CropData {
  cropId: string;
  cropCode: string;
  cropName: string;
  landType: string;
  cropImage?: string;
  cropImageMimeType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CropService extends ServiceBase {
  private _crops: Map<number, Crop>;

  constructor(
    private http: HttpProvider,
    private refDataService: ReferenceDataService,
    private storageService: StorageService) {
    super();
    this._crops = new Map<number, Crop>();
  }

  private static getCropImageUrl(data: CropData) {
    return data.cropImage ?
      'data:' + data.cropImageMimeType + ';base64,' + data.cropImage : '../../assets/images/crop.png';
  }

  initializeData(data: CropData[] = null) {
    if (data != null) {
      this._crops.clear();
      data.forEach(d => {
        const c = this.getCropFromData(d);
        this._crops.set(c.cropId, c);
      });
      this.storeCrops();
    } else {
      const cached = this.storageService.get(StorageKeys.crops);
      if (cached != null) {
        this._crops = new Map(JSON.parse(cached));
      } else {
        console.log('No crops in cache');
      }
    }
  }

  get crops() {
    return this._crops;
  }

  find(cropId: number) {
    return this._crops.get(cropId);
  }

  findbyCropIds(cropIds: number[]) {
    return new Map([...this._crops].filter(([k, v]) => (cropIds.includes(k))));
  }

  findByCropCode(cropCode: string): Crop {
    return [...this._crops].find(([k, v]) => v.cropCode === cropCode)[1];
  }

  findbyCropCodes(cropCodes: string[]) {
    return new Map([...this._crops].filter(([k, v]) => (cropCodes.includes(v.cropCode))));
  }

  synchronizeCropData() {
    return this.http
      .get<CropData[]>(this.getServiceUrl(ServiceUrl.cropData))
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

  private getCropFromData(data: CropData) {
    const crop = new Crop();
    crop.cropId = +data.cropId;
    crop.cropCode = data.cropCode;
    crop.cropName = data.cropName;
    crop.landType = this.refDataService.getLandTypeDesc(data.landType);
    crop.cropImage = CropService.getCropImageUrl(data);

    return crop;
  }

  private storeCrops() {
    this.storageService.set(StorageKeys.crops, JSON.stringify([...this._crops.entries()]));
  }
}
