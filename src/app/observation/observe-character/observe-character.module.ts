import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObserveCharacterPageRoutingModule } from './observe-character-routing.module';

import { ObserveCharacterPage } from './observe-character.page';
import { Pc14nComponentsModule } from 'src/app/pc14n-components/pc14n-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObserveCharacterPageRoutingModule,
    Pc14nComponentsModule
  ],
  declarations: [ObserveCharacterPage]
})
export class ObserveCharacterPageModule {}
