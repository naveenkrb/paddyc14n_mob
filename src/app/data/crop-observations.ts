/* eslint-disable no-underscore-dangle */
import { Crop } from './crop';
import { Observation } from './observation';
import { Season } from './season';

export class CropObservations {
  private _planId: number;
  private _location: string;
  private _season: Season;
  private _crop: Crop;
  private _observations: Observation[];

  constructor(planId: number, location: string, season: Season, crop: Crop) {
    this._planId = planId;
    this._location = location;
    this._season = season;
    this._crop = crop;
    this._observations = [];
  }

  get location() {
    return this._location;
  }

  get season() {
    return this._season;
  }

  get crop() {
    return this._crop;
  }

  get observations() {
    return this._observations;
  }

  addObservation(observation: Observation) {
    let index = -1;
    if (observation.wipId && observation.wipId.length > 0) {
      index = this._observations.findIndex(o => o.wipId === observation.wipId);
    }

    if (index !== -1) {
      this._observations[index] = observation;
    } else {
      this._observations.push(observation);
    }
  }

  get planId() {
    return this._planId;
  }
}
