/* eslint-disable no-underscore-dangle */
import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PlanningService } from '../services/planning.service';
import { CropPlan } from '../data/crop-plan';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})
export class ObservationPage implements OnInit, DoCheck {
  private _activeSeasons: CropPlan[];

  constructor(
    private planningService: PlanningService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  ngDoCheck(){
    this._activeSeasons = this.planningService.findPlansByLocation(this.currentLocation);
  }

  get activeSeasons() {
    return this._activeSeasons;
  }

  get haveSeasons() {
    return this._activeSeasons && this._activeSeasons !== null && this._activeSeasons.length > 0;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }
}
