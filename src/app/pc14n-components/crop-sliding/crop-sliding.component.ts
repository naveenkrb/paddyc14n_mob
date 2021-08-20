import { Component, Input, OnInit } from '@angular/core';
import { IonItemSliding, IonSlide } from '@ionic/angular';
import { Crop } from 'src/app/data/crop';
import { PlanningService } from 'src/app/services/planning.service';

@Component({
  selector: 'app-crop-sliding',
  templateUrl: './crop-sliding.component.html',
  styleUrls: ['./crop-sliding.component.scss'],
})
export class CropSlidingComponent implements OnInit {
  @Input() crop: Crop;
  @Input() allowRemove = true;

  constructor(private planningService: PlanningService) { }

  ngOnInit() { }

  clickAdd(slider: IonItemSliding) {
    //console.log(this.planningService.currentPlan);
    this.planningService.currentPlan.addCrop(this.crop.cropId);
    //console.log(this.planningService.currentPlan);
    slider.close();
  }

  clickRemove(slider: IonItemSliding) {
    this.planningService.currentPlan.removeCrop(this.crop.cropId);
    slider.close();
  }

}
