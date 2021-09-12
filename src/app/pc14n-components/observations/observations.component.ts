/* eslint-disable no-underscore-dangle */
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observation } from 'src/app/data/observation';
import { ObservationsService } from 'src/app/services/observations.service';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent implements OnInit {
  @Input() planId: number;
  @Input() cropId: number;
  @Input() characterId: number;

  observations: Observation[];

  constructor(
    private observationsService: ObservationsService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loadingController.create({
      message: 'Fetching past observations ...',
      spinner: 'crescent',
    }).then(le => {
      le.present().then(() => {
        this.observationsService
          .fetchObservations(+this.planId, +this.cropId, +this.characterId)
          .subscribe(
            data => {
              le.dismiss();
              this.observations = data;
            },
            error => {
              le.dismiss();
            }
          );
      });
    });
  }

  getDataUrlFromObservation(observation: Observation) {
    if (observation.observationImage && observation.observationImageMimeType) {
      return 'data:' + observation.observationImageMimeType + ';base64,' + observation.observationImage;
    }
  }

  getUrlFromObservation(observation: Observation) {
    return this.observationsService.getObservationImageUrl(observation);
  }

  observationTrackBy(index: number, observation: Observation) {
    return observation.observationId;
  }

  getRecordedAtFromObservation(observation: Observation) {
    if (observation.recordedAt instanceof Date) {
      return Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false,
        timeZone: 'Asia/Kolkata'
      }).format(observation.recordedAt);
    } else {
      return observation.recordedAt;
    }
  }
}
