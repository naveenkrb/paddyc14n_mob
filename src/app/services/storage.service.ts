/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageKeys } from '../common/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _age: Map<string, Date>;

  constructor(private storage: Storage) {
    this.init();
  }

  init() {
    this.storage.create().then(storage => {
      this._storage = storage;
      if (this.hasKey(StorageKeys.age)) {
        this._age = this.getAgeFromStorage();
      } else {
        this._age = new Map<string, Date>();
      }
    }).catch(error => console.log(error));
  }

  public set(key: StorageKeys, value: any, withAge = true) {
    this._storage?.set(key, value).then(v => {
      if (withAge) {
        this._age.set(key.valueOf(), new Date());
        this.putAgeInStorage();
      }
    });
  }

  public get(key: StorageKeys): any {
    this._storage?.get(key.valueOf()).then(value => value);
  }

  public getAge(key: StorageKeys) {
    return this._age.get(key.valueOf());
  }

  public hasKey(key: StorageKeys) {
    let matched = false;
    this._storage?.keys().then(keys => matched = (keys.findIndex(k => k === key.valueOf()) !== -1));
    return matched;
  }

  public remove(key: StorageKeys) {
    if (this.hasKey(key)) {
      this._storage.remove(key.valueOf());
      if (this._age.has(key.valueOf())) {
        this._age.delete(key.valueOf());
      }
    }
  }

  private getAgeFromStorage() {
    return new Map<string, Date>(JSON.parse(this.get(StorageKeys.age)));
  }

  private putAgeInStorage() {
    this.set(StorageKeys.age, JSON.stringify([...this._age.entries()]), false);
  }
}
