import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlannedCropsPageRoutingModule } from './planned-crops-routing.module';

import { PlannedCropsPage } from './planned-crops.page';
import { Pc14nComponentsModule } from 'src/app/pc14n-components/pc14n-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlannedCropsPageRoutingModule,
    Pc14nComponentsModule
  ],
  declarations: [PlannedCropsPage]
})
export class PlannedCropsPageModule { }
