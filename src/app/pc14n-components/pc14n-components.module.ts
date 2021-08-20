import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CropComponent } from './crop/crop.component';
import { CropSlidingComponent } from './crop-sliding/crop-sliding.component';
import { SeasonComponent } from './season/season.component';
import { CharacterComponent } from './character/character.component';
import { ReadingComponent } from './reading/reading.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';



@NgModule({
  declarations: [CropComponent, CropSlidingComponent, SeasonComponent, CharacterComponent, ReadingComponent, ImagePickerComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CropComponent, CropSlidingComponent, SeasonComponent, CharacterComponent, ReadingComponent, ImagePickerComponent]
})
export class Pc14nComponentsModule { }
