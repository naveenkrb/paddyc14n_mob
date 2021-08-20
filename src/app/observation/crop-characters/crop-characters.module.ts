import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropCharactersPageRoutingModule } from './crop-characters-routing.module';

import { CropCharactersPage } from './crop-characters.page';
import { Pc14nComponentsModule } from 'src/app/pc14n-components/pc14n-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropCharactersPageRoutingModule,
    Pc14nComponentsModule
  ],
  declarations: [CropCharactersPage]
})
export class CropCharactersPageModule {}
