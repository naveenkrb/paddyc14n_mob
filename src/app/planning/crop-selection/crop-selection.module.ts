import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropSelectionPageRoutingModule } from './crop-selection-routing.module';

import { CropSelectionPage } from './crop-selection.page';
import { Pc14nComponentsModule } from 'src/app/pc14n-components/pc14n-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropSelectionPageRoutingModule,
    Pc14nComponentsModule
  ],
  declarations: [CropSelectionPage]
})
export class CropSelectionPageModule { }
