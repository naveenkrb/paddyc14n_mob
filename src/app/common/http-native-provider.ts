import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from } from 'rxjs';

@Injectable()
export class HttpNativeProvider {
  constructor(public http: HTTP) {
    http.setServerTrustMode('nocheck').then(() => {
      console.log('pc14n server trust mode set');
    }, () => {
      console.log('pc14n server tletrust mode could not be set');
    });
  }

  public getImageUrl(url: string) {
    this.http.setRequestTimeout(10);
    let dataUrl = url;
    this.http.getSync(url, {}, {},
      result => dataUrl = ('data:' + result.data.mimeType + ';base64,' + result.data.data),
      error => console.log(error));
    return dataUrl;
  }

  public get<T>(url: string, params?: any, options: any = {}) {
    const responseData = this.http.get(url, params, {})
      .then(resp => JSON.parse(resp.data) as T, error => error);

    return from(responseData);
  }

  public post<T>(url: string, params?: any, options: any = {}) {
    this.http.setDataSerializer('json');
    const responseData = this.http.post(url, params, {})
      .then(resp => JSON.parse(resp.data) as T, error => error);

    return from(responseData);
  }
}
