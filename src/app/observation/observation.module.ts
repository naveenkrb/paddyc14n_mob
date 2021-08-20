import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObservationPageRoutingModule } from './observation-routing.module';

import { ObservationPage } from './observation.page';
import { Pc14nComponentsModule } from '../pc14n-components/pc14n-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObservationPageRoutingModule,
    Pc14nComponentsModule
  ],
  declarations: [ObservationPage]
})
export class ObservationPageModule {}
