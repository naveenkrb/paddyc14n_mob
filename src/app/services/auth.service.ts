/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { ServiceUrl } from '../common/service-url';
import { ServiceResponse } from '../data/service-response';
import { UserProfile } from '../data/user-profile';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { StorageKeys } from '../common/storage-keys';
import { HttpProvider } from '../common/http-provider';

interface AuthData {
  user: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ServiceBase {
  private _userProfile: UserProfile;
  private _loggedIn = false;
  private _location: string;

  constructor(
    private http: HttpProvider,
    private storageService: StorageService) {
    super();
  }

  get isLoggedIn() {
    return this._loggedIn;
  }

  get userProfile(): UserProfile {
    return this._userProfile;
  }

  login(uid: string, pwd: string) {
    const requestData: AuthData = { user: uid, password: pwd };

    return this.http
      .post<ServiceResponse<UserProfile>>(
        this.getServiceUrl(ServiceUrl.login),
        requestData)
      .pipe(
        catchError(error => {
          throw error;
        }),
        tap(response => {
          if (this.hasNoError(response)) {
            this._userProfile = response.appData;
            this.currentLocation = this._userProfile.userLocations[0];
            this._loggedIn = true;

            this.storageService.set(StorageKeys.auth, requestData);
            this.storageService.set(StorageKeys.userProfile, this._userProfile);
          }
        })
      );

  }

  logout() {
    return this.http
      .get<ServiceResponse<any>>(
        this.getServiceUrl(ServiceUrl.logout))
      .pipe(
        catchError(error => {
          throw error;
        }),
        tap(response => {
          if (this.hasNoError(response)) {
            this._userProfile = null;
            this.currentLocation = null;
            this._loggedIn = false;

            this.storageService.remove(StorageKeys.userProfile);
          }
        })
      );
  }

  forgotPassword(uid: string) {
    const requestData: AuthData = { user: uid };

    return this.http
      .post<ServiceResponse<any>>(
        this.getServiceUrl(ServiceUrl.forgotPassword),
        requestData)
      .pipe(
        catchError(error => {
          throw error;
        }),
        tap(response => {
          if (this.hasNoError(response)) {
            this._userProfile = null;
            this.currentLocation = null;
            this._loggedIn = false;

            this.storageService.remove(StorageKeys.userProfile);
          }
        })
      );
  }

  get currentLocation() {
    return this._location;
  }

  set currentLocation(location: string) {
    this._location = location;
  }
}
