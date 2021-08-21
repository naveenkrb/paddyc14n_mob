import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpNgProvider {
  constructor(public http: HttpClient) { }

  public get<T>(url: string, params?: any, options: any = {}) {
    options.params = params;
    return this.http.get<T>(url, options);
  }

  public post<T>(url: string, params: any, options: any = {}) {
    return this.http.post<T>(url, params, options);
  }
}
