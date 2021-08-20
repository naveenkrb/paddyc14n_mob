/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { IonDatetime, IonSelect } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ReferenceDataService } from '../services/reference-data.service';
import { Season } from '../data/season';
import { SeasonService } from '../services/season.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {
  private _seasons: Map<string, Season>;
  private _inSearch = false;

  constructor(
    private authService: AuthService,
    private refDataService: ReferenceDataService,
    private seasonService: SeasonService) { }

  ngOnInit() {
    this._seasons = null;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }

  get states() {
    return this.refDataService.states;
  }

  get seasons() {
    return this._seasons !== null ? this._seasons : null;
  }

  get haveSeasons() {
    return this._seasons !== null && this._seasons.size > 0;
  }

  get inSearch() {
    return this._inSearch;
  }

  get currentYear() {
    return new Date().getFullYear();
  }

  findSeasons(stateCode: string, startYear: string) {
    this._inSearch = true;
    if ((stateCode && startYear) &&
      (stateCode.length > 0 && startYear.length > 0)) {
      this._seasons = this.seasonService.
        findByStateCodeStartYear(stateCode, Number.parseInt(startYear, 10));
    }
  }

  clearInputs(stateCode: IonSelect, startYear: IonDatetime) {
    stateCode.value = '';
    startYear.value = '';
    this._seasons = null;
    this._inSearch = false;
  }
}
