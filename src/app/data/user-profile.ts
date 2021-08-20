/* eslint-disable no-underscore-dangle */
export class UserProfile {
  private _userId: string;
  private _name: string;
  private _locations: string[];

  constructor(id: string, name: string) {
    this._userId = id;
    this._name = name;
  }

  get userId() {
    return this._userId;
  }

  get userName() {
    return this._name;
  }

  get userLocations() {
    return this._locations;
  }

  set userLocations(locations: string[]) {
    this._locations = locations;
  }
}
