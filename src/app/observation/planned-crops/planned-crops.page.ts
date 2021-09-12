/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CropService } from 'src/app/services/crop.service';
import { PlanningService } from 'src/app/services/planning.service';
import { Crop } from 'src/app/data/crop';
import { CropPlan } from 'src/app/data/crop-plan';

@Component({
  selector: 'app-planned-crops',
  templateUrl: './planned-crops.page.html',
  styleUrls: ['./planned-crops.page.scss'],
})
export class PlannedCropsPage implements OnInit {
  private _currentPlan: CropPlan;
  private _crops: Map<number, Crop>;
  private _cropFilter: string;

  constructor(
    private authService: AuthService,
    private planningService: PlanningService,
    private cropService: CropService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(pm => {
      if (pm.has('planId')) {
        const planId = +pm.get('planId');
        this._currentPlan = this.planningService.findPlanById(planId);
        this._crops = this.cropService.findbyCropIds(this._currentPlan.crops);
      } else {
        this.navController.navigateBack('/observation');
      }
    });
  }

  get currentPlan() {
    return this._currentPlan;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }

  get crops() {
    return this.filterCrops();
  }

  get season() {
    return this._currentPlan.season;
  }

  setCropFilter(filterValue: string) {
    this._cropFilter = filterValue;
  }

  trackByCropId(index: number, crop: Crop) {
    return crop.cropId;
  }

  private filterCrops() {
    let filteredCrops = this._crops;

    if (this._cropFilter && this._cropFilter != null && this._cropFilter.length > 0) {
      filteredCrops = new Map([...this._crops].filter(([k, v]) =>
        v.cropCode.includes(this._cropFilter) || v.cropName.includes(this._cropFilter)
      ));
    }

    return filteredCrops;
  }

}
