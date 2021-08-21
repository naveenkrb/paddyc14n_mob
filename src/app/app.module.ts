import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { HttpProvider } from './common/http-provider';
import { HttpNgProvider } from './common/http-ng-provider';
import { HttpNativeProvider } from './common/http-native-provider';
import { httpInterceptorProviders } from './common/http-interceptors';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), IonicStorageModule.forRoot({
    name: 'pc14n',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
  }), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpProvider, HttpNgProvider, HttpNativeProvider, HTTP, httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule { }
