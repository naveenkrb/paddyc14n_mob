import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/data/character';
import { ReferenceDataService } from 'src/app/services/reference-data.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements OnInit {
  @Input() character: Character;
  @Input() buttonDetail = false;
  @Input() hasObservation = false;

  constructor(private refDataService: ReferenceDataService) { }

  ngOnInit() { }

  getCharacterTypeDesc() {
    switch (this.character.characterType) {
      case 'S':
        return 'Select';
      case 'M':
        return 'Measure';
    }
  }

  getCharacterStageDesc() {
    return (this.refDataService.characterStages.find(v => v[0] === this.character.characterStage))[1];
  }
}
