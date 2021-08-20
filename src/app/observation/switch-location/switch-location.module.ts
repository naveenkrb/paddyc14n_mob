import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwitchLocationPageRoutingModule } from './switch-location-routing.module';

import { SwitchLocationPage } from './switch-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwitchLocationPageRoutingModule
  ],
  declarations: [SwitchLocationPage]
})
export class SwitchLocationPageModule {}
