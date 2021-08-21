import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpNativeProvider } from './http-native-provider';
import { HttpNgProvider } from './http-ng-provider';

@Injectable()
export class HttpProvider {
  private http: HttpNativeProvider | HttpNgProvider;

  constructor(private platform: Platform, private angularHttp: HttpNgProvider, private nativeHttp: HttpNativeProvider) {
    this.http = this.platform.is('ios') || this.platform.is('android') ? this.nativeHttp : this.angularHttp;
  }

  public get<T>(url: string, params?: any, options?: any) {
    return this.http.get<T>(url, params, options);
  }

  public post<T>(url: string, params?: any, options?: any) {
    return this.http.post<T>(url, params, options);
  }
}
