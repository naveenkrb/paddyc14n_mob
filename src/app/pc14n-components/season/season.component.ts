import { Component, Input, OnInit } from '@angular/core';
import { Season } from 'src/app/data/season';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss'],
})
export class SeasonComponent implements OnInit {
  @Input() season: Season;
  @Input() buttonDetail = false;
  constructor() { }

  ngOnInit() { }

}
