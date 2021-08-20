import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Reading } from 'src/app/data/reading';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
})
export class ReadingComponent implements OnInit {
  @Input() readings: Reading[];
  @Output() readingPick = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  setReading(value: string) {
    this.readingPick.emit(value);
  }

}
