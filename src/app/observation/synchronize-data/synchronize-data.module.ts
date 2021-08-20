import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynchronizeDataPageRoutingModule } from './synchronize-data-routing.module';

import { SynchronizeDataPage } from './synchronize-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SynchronizeDataPageRoutingModule
  ],
  declarations: [SynchronizeDataPage]
})
export class SynchronizeDataPageModule {}
