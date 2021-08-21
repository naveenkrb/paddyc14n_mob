/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ServiceUrl } from '../common/service-url';
import { StorageKeys } from '../common/storage-keys';
import { Season } from '../data/season';
import { StorageService } from './storage.service';
import { ServiceBase } from './service-base';
import { tap } from 'rxjs/operators';
import { HttpProvider } from '../common/http-provider';

export interface SeasonData {
  seasonId: string;
  stateCode: string;
  startYear: string;
  endYear: string;
  seasonCode: string[];
  seasonName: string[];
  startDate: string[];
  endDate: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeasonService extends ServiceBase {
  private _seasons: Map<string, Season>;

  constructor(
    private http: HttpProvider,
    private storageService: StorageService) {
    super();
    this._seasons = new Map<string, Season>();
  }

  initializeData(data: SeasonData[] = null) {
    if (data != null) {
      this._seasons.clear();
      data.forEach(d => {
        const seasons = this.getSeasonFromData(d);
        seasons.forEach(s => this._seasons.set(s.seasonCode, s));
      });
      this.storeSeasons();
    } else {
      const cached = this.storageService.get(StorageKeys.seasons);
      if (cached != null) {
        this._seasons = new Map(JSON.parse(cached));
      } else {
        console.log('No seasons in cache');
      }
    }
  }


  findByStateCodeStartYear(stateCode: string, startYear: number) {
    return new Map([...this._seasons].filter(([k, v]) =>
      (v.stateCode === stateCode && v.startYear === startYear)
    ));
  }

  findBySeasonCodes(seasonCodes: string[]) {
    if (seasonCodes === null || (seasonCodes !== null && seasonCodes.length <= 0)) {
      return null;
    } else {
      return [...this._seasons].filter(([k, v]) => seasonCodes.includes(k)).map(([k, v]) => v);
    }
  }

  find(seasonCode: string) {
    return this._seasons.get(seasonCode);
  }

  synchronizeSeasonData() {
    return this.http
      .get<SeasonData[]>(this.getServiceUrl(ServiceUrl.seasonData))
      .pipe(
        tap(
          data => this.initializeData(data),
          error => {
            this.initializeData();
            throw error;
          })
      );
  }

  private getSeasonFromData(data: SeasonData) {
    const seasons: Season[] = [];
    for (let index = 0; index < data.seasonCode.length; index++) {
      const season = new Season();

      season.id = +data.seasonId;
      season.stateCode = data.stateCode;
      season.startYear = +data.startYear;
      season.endYear = +data.endYear;
      season.seasonCode = data.seasonCode[index];
      season.seasonName = data.seasonName[index];
      season.startDate = data.startDate[index];
      season.endDate = data.endDate[index];

      seasons.push(season);
    }

    return seasons;
  }

  private storeSeasons() {
    this.storageService.set(StorageKeys.seasons, JSON.stringify([...this._seasons.entries()]));
  }
}
