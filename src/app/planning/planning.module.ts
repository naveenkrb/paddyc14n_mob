import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanningPageRoutingModule } from './planning-routing.module';

import { PlanningPage } from './planning.page';
import { Pc14nComponentsModule } from '../pc14n-components/pc14n-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanningPageRoutingModule,
    Pc14nComponentsModule
  ],
  declarations: [PlanningPage]
})
export class PlanningPageModule { }
