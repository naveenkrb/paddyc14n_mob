import { Component, Input, OnInit } from '@angular/core';
import { Crop } from 'src/app/data/crop';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss'],
})
export class CropComponent implements OnInit {
  @Input() crop: Crop;
  @Input() emphasis = false;
  @Input() buttonDetail = false;
  @Input() lines = true;

  constructor() { }

  ngOnInit() { }

}
