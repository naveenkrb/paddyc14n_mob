/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpNativeProvider } from './http-native-provider';
import { HttpNgProvider } from './http-ng-provider';

@Injectable()
export class HttpProvider {
  private http: HttpNativeProvider | HttpNgProvider;
  private _native = false;

  constructor(
    private platform: Platform,
    private angularHttp: HttpNgProvider,
    private nativeHttp: HttpNativeProvider) {
    this._native = this.platform.is('cordova');
    this.http = this._native ? this.nativeHttp : this.angularHttp;
  }

  get isNative() {
    return this._native;
  }

  public getImageUrl(url: string) {
    if (this.isNative) {
      console.log('Fetching native image url');
      return this.nativeHttp.getImageUrl(url);
    } else {
      return url;
    }
  }

  public get<T>(url: string, params?: any, options?: any) {
    return this.http.get<T>(url, params, options);
  }

  public post<T>(url: string, params?: any, options?: any) {
    return this.http.post<T>(url, params, options);
  }
}
