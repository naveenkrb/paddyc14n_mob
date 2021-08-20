import { Season } from '../data/season';
import { v4 as uuid } from 'uuid';

/* eslint-disable no-underscore-dangle */
export class CropPlan {
  private _planId?: number;
  private _location: string;
  private _season: Season;
  private _crops: number[];
  private _isDirty = false;
  private _wipId: string;

  constructor(location: string, season: Season, planId?: number) {
    this._location = location;
    this._season = season;
    this._crops = [];
    this._planId = planId;
  }

  addCrop(cropId: number) {
    this._crops.push(cropId);
    this._isDirty = true;
    this._wipId = this._wipId ?? uuid();
    console.log(this.wipId);
  }

  removeCrop(cropId: number) {
    this._crops = this._crops.filter((x) => x !== cropId);
    this._isDirty = true;
    this._wipId = this._wipId ?? uuid();
  }

  get planId() {
    return this._planId;
  }

  set planId(id: number) {
    this._planId = id;
  }

  get season() {
    return this._season;
  }

  get location() {
    return this._location;
  }

  get crops() {
    return this._crops;
  }

  set crops(crops: number[]) {
    this._crops = crops;
  }

  get isDirty() {
    return this._isDirty;
  }

  get wipId() {
    return this._wipId;
  }

  resetIsDirty() {
    this._isDirty = false;
    this._wipId = null;
  }
}
