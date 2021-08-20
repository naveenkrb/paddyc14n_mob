/* eslint-disable no-underscore-dangle */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ResultCode } from 'src/app/common/result-code';
import { Crop } from 'src/app/data/crop';
import { CropPlan } from 'src/app/data/crop-plan';
import { AuthService } from 'src/app/services/auth.service';
import { CropService } from 'src/app/services/crop.service';
import { PlanningService } from 'src/app/services/planning.service';
import { SeasonService } from 'src/app/services/season.service';

@Component({
  selector: 'app-crop-selection',
  templateUrl: './crop-selection.page.html',
  styleUrls: ['./crop-selection.page.scss'],
})
export class CropSelectionPage implements OnInit {
  private _seasonCode: string;
  private _crops: Map<number, Crop>;
  private _cropFilter: string;
  private _cropToggle: boolean;

  constructor(
    private authService: AuthService,
    private cropService: CropService,
    private planningService: PlanningService,
    private seasonService: SeasonService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(pm => {
      if (pm.has('seasonCode')) {
        this._seasonCode = pm.get('seasonCode');
        let plan = this.planningService.findPlanByLocationAndSeason(
          this.currentLocation, this._seasonCode, false);
        if (!plan) {
          plan = new CropPlan(
            this.currentLocation,
            this.seasonService.find(this._seasonCode));
        }
        this.planningService.currentPlan = plan;
      } else {
        this.navController.navigateBack('/planning');
      }
    });
  }

  ionViewWillEnter() {
    this._crops = this.cropService.crops;
    this._cropToggle = false;
  }

  get crops() {
    return this._crops;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }

  get season() {
    return this.seasonService.find(this._seasonCode);
  }

  isCropInCurrentPlan(cropId: number) {
    return this.planningService.currentPlan.crops.includes(cropId);
  }

  setCropFilter(filterValue: string) {
    this._cropFilter = filterValue;
    this.filterCrops();
  }

  toggleCrops(isChecked: boolean) {
    this._cropToggle = isChecked;
    this.filterCrops();
  }

  savePlan() {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Saving Plan ...',
      //spinner: 'dots',
    }).then(le => {
      le.present().then(() => {
        this.planningService.saveCurrentPlan()
          .subscribe(
            response => {
              le.dismiss();
              if (response.appResult.resultCode === ResultCode.noError) {
                this.navController.navigateBack('/planning');
              } else {
                this.showAlert(response.appResult.resultMessage ?? response.appResult.resultCode);
              }
            },
            error => {
              le.dismiss();
              console.error(error);
              if ((error as HttpErrorResponse).status === 403) {
                this.navController.navigateRoot('/auth');
              }
              this.showAlert('Technical error');
            });
      });
    });
  }

  private showAlert(_message: string) {
    this.alertController.create({
      header: 'Save plan failed',
      message: _message,
      buttons: ['Ok'],
      keyboardClose: true,
    }).then(ae => ae.present());
  }

  private filterCrops() {
    let filteredCrops = this.cropService.crops;

    if (this._cropFilter && this._cropFilter != null && this._cropFilter.length > 0) {
      filteredCrops = new Map([...filteredCrops].filter(([k, v]) =>
        v.cropCode.includes(this._cropFilter) || v.cropName.includes(this._cropFilter)
      ));
    }

    if (this._cropToggle) {
      this._crops = new Map([...filteredCrops].filter(([k, v]) =>
        this.isCropInCurrentPlan(k)
      ));
    } else {
      this._crops = filteredCrops;
    }
  }
}
