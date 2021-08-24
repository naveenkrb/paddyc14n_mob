/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CharacterService } from 'src/app/services/character.service';
import { CropService } from 'src/app/services/crop.service';
import { PlanningService } from 'src/app/services/planning.service';
import { ObservationsService } from 'src/app/services/observations.service';
import { CropPlan } from 'src/app/data/crop-plan';
import { Observation } from 'src/app/data/observation';
import { ResultCode } from 'src/app/common/result-code';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageData } from 'src/app/pc14n-components/image-picker/image-picker.component';
import { v4 as uuid } from 'uuid';
import { Crop } from 'src/app/data/crop';
import { Character } from 'src/app/data/character';

@Component({
  selector: 'app-observe-character',
  templateUrl: './observe-character.page.html',
  styleUrls: ['./observe-character.page.scss'],
})
export class ObserveCharacterPage implements OnInit {
  private _currentPlan: CropPlan;
  private _crop: Crop;
  private _character: Character;
  private _observation: Observation;
  private _currentObservationsIndex = -1;

  constructor(
    private authService: AuthService,
    private cropService: CropService,
    private characterService: CharacterService,
    private planningService: PlanningService,
    private observationsService: ObservationsService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this._observation = new Observation();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(pm => {
      if (pm.has('planId') && pm.has('cropId') && pm.has('characterId')) {
        this._currentPlan = this.planningService.findPlanById(+pm.get('planId'));
        this._crop = this.cropService.find(+pm.get('cropId'));
        this._character = this.characterService.find(+pm.get('characterId'));
        this._currentObservationsIndex = this.observationsService.findObservationsIndex(
          this.currentPlan.planId, this._crop.cropId, true);
        this._observation.characterId = this._character.characterId;
      } else {
        this.navController.navigateBack('/observation');
      }
    });
  }

  onImagePicked(imageData: ImageData) {
    if (imageData.image.startsWith('data')) {
      // Image as Data URL
      const imageDataUrl = imageData.image.split(',');
      console.log(imageDataUrl[0]);
      this._observation.observationImage = imageDataUrl[1];
    } else {
      // Image as Base64, returns an error that it is long, fall back on data url in that case
      this._observation.observationImage = imageData.image;
    }
    this._observation.observationImageMimeType = 'image/' + imageData.format;
  }

  get currentPlan() {
    return this._currentPlan;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }

  get season() {
    return this._currentPlan.season;
  }

  get crop() {
    return this._crop;
  }

  get character() {
    return this._character;
  }

  setObservation(observation: string) {
    this._observation.observation = observation;
  }

  saveObservation(remarks: string) {
    this._observation.remarks = remarks;
    this._observation.wipId = this._observation.wipId ?? uuid();
    this._observation.recordedAt = new Date();

    if (this.isValidObservation(this._observation)) {
      this.loadingController.create({
        keyboardClose: true,
        message: 'Saving Observation ...',
        //spinner: 'dots',
      }).then(le => {
        le.present().then(() => {
          this.observationsService.addObservationToIndex(this._currentObservationsIndex, this._observation)
            .subscribe(
              response => {
                le.dismiss();
                if (response.appResult.resultCode === ResultCode.noError) {
                  this.navController.back();
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
              }
            );
        });
      });
    } else {
      this.showAlert('Please provide required inputs');
    }
  }

  private isValidObservation(observation: Observation): boolean {
    if (!observation.observation) {
      return false;
    }

    if (this._character.captureImage && !observation.observationImage) {
      return false;
    }

    if (observation.observation.length <= 0) {
      return false;
    }

    if (this._character.captureImage && observation.observationImage.length <= 0) {
      return false;
    }

    return true;
  }

  private showAlert(_message: string) {
    this.alertController.create({
      header: 'Save Observation',
      keyboardClose: true,
      buttons: ['Ok'],
      message: _message
    }).then(ae => ae.present());
  }
}
