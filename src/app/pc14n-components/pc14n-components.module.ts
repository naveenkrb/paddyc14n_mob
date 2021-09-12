import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CropComponent } from './crop/crop.component';
import { CropSlidingComponent } from './crop-sliding/crop-sliding.component';
import { SeasonComponent } from './season/season.component';
import { CharacterComponent } from './character/character.component';
import { ReadingComponent } from './reading/reading.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { ObservationsComponent } from './observations/observations.component';

@NgModule({
  declarations: [
    CropComponent,
    CropSlidingComponent,
    SeasonComponent,
    ReadingComponent,
    ImagePickerComponent,
    CharacterComponent,
    ObservationsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    CropComponent,
    CropSlidingComponent,
    SeasonComponent,
    CharacterComponent,
    ReadingComponent,
    ImagePickerComponent,
    ObservationsComponent
  ]
})
export class Pc14nComponentsModule { }
