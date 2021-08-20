/* eslint-disable no-underscore-dangle */
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnDestroy {
  private _isConnected = false;
  private _connectionType: string;
  private _stateObserver: Subscription;

  constructor(private network: Network) {
    this._stateObserver = network.onChange().subscribe(state => {
      switch (state) {
        case 'connected':
          this._isConnected = true;
          setTimeout(() => {
            this._connectionType = network.type;
            console.log('Network connected, type = ' + this._connectionType);
          }, 3000);
          break;
        case 'disconnected':
          this._isConnected = false;
          console.log('Network disconnected');
          break;
      }
    });
  }

  ngOnDestroy() {
    this._stateObserver.unsubscribe();
  }

  get isConnected() {
    return this._isConnected;
  }

  get connectionType() {
    return this._connectionType;
  }

}
