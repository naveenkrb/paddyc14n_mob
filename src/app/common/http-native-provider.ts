import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from } from 'rxjs';
import { ObservationImageData } from '../services/observations.service';

@Injectable()
export class HttpNativeProvider {
  constructor(public http: HTTP) {
    http.setServerTrustMode('pinned').then(() => {
      console.log('pc14n server trust mode set');
    }, () => {
      console.log('pc14n server tletrust mode could not be set');
    });
  }

  public getImageUrl(url: string) {
    this.http.setRequestTimeout(10);
    let dataUrl = null;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.http.getSync(url, {}, { Accept: 'application/json' },
      result => {
        console.log(result);
        const imageData = JSON.parse(result.data) as ObservationImageData;
        console.log(imageData);
        dataUrl = ('data:' + imageData.mimeType + ';base64,' + imageData.data);
        console.log(dataUrl.length);
      },
      error => console.log(error));
    return dataUrl;
  }

  public get<T>(url: string, params?: any, options: any = {}) {
    const responseData = this.http.get(url, params, options)
      .then(resp => JSON.parse(resp.data) as T, error => error);

    return from(responseData);
  }

  public post<T>(url: string, params?: any, options: any = {}) {
    this.http.setDataSerializer('json');
    const responseData = this.http.post(url, params, options)
      .then(resp => JSON.parse(resp.data) as T, error => error);

    return from(responseData);
  }
}
