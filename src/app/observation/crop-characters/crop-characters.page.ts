/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar, IonSelect, IonToggle, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CharacterService } from 'src/app/services/character.service';
import { CropService } from 'src/app/services/crop.service';
import { ReferenceDataService } from 'src/app/services/reference-data.service';
import { ObservationsService } from 'src/app/services/observations.service';
import { PlanningService } from 'src/app/services/planning.service';
import { Character } from 'src/app/data/character';
import { CropPlan } from 'src/app/data/crop-plan';

@Component({
  selector: 'app-crop-characters',
  templateUrl: './crop-characters.page.html',
  styleUrls: ['./crop-characters.page.scss'],
})
export class CropCharactersPage implements OnInit {
  private _currentPlan: CropPlan;
  private _cropId: number;
  private _characters: Map<number, Character>;
  private _characterFilter: string;
  private _stageFilter: string;
  private _inSearch = false;
  private _characterToggle = false;

  constructor(
    private authService: AuthService,
    private cropService: CropService,
    private characterService: CharacterService,
    private planningService: PlanningService,
    private observationsService: ObservationsService,
    private refDataService: ReferenceDataService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(pm => {
      if (pm.has('planId') && pm.has('cropId')) {
        this._currentPlan = this.planningService.findPlanById(+pm.get('planId'));
        this._cropId = +pm.get('cropId');
      } else {
        this.navController.navigateBack('/observation');
      }
    });
  }

  get currentPlan() {
    return this._currentPlan;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }

  get season() {
    return this._currentPlan.season;
  }

  get crop() {
    return this.cropService.find(this._cropId);
  }

  get stages() {
    return this.refDataService.characterStages;
  }

  get characters() {
    return this._characters;
  }

  get haveCharacters() {
    return this._characters != null && this._characters.size > 0;
  }

  get inSearch() {
    return this._inSearch;
  }

  trackByCharacterId(index: number, character: Character) {
    return character.characterId;
  }

  setCharacterFilter(filterValue: string) {
    this._characterFilter = filterValue;
    this.filterCharacters();
  }

  toggleCharacters(isChecked: boolean) {
    this._characterToggle = isChecked;
    this.filterCharacters();
  }

  findCharacters(stage: string) {
    this._stageFilter = stage;
    this.filterCharacters();
  }

  clearInputs(stage: IonSelect, characterFilter: IonSearchbar, characterToggle: IonToggle) {
    stage.value = '';
    characterFilter.value = '';
    characterToggle.checked = false;

    this._characters = null;
    this._inSearch = false;
    this._characterToggle = false;
    this._characterFilter = '';
  }

  isCharacterAlreadyObserved(characterId: number) {
    const currentObservations = this.observationsService.findObservations(
      this._currentPlan.planId, this._cropId);

    if (!currentObservations) {
      return false;
    }

    return (currentObservations.observations.find(v => v.characterId === characterId) !== undefined);
  }

  private filterCharacters() {
    this._inSearch = true;
    if (!this._stageFilter && !this._characterFilter) {
      this._characters = null;
      return;
    }

    let filteredCharacters = this.characterService.characters;

    if (this._stageFilter && this._stageFilter != null && this._stageFilter.length > 0) {
      filteredCharacters = new Map([...filteredCharacters].filter(([k, v]) =>
        v.characterStage === this._stageFilter
      ));
    }

    if (this._characterFilter && this._characterFilter != null && this._characterFilter.length > 0) {
      filteredCharacters = new Map([...filteredCharacters].filter(([k, v]) =>
        v.characterCode.includes(this._characterFilter) || v.characterName.includes(this._characterFilter)
      ));
    }

    if (this._characterToggle) {
      this._characters = new Map([...filteredCharacters].filter(([k, v]) =>
        this.isCharacterAlreadyObserved(v.characterId)
      ));
    } else {
      this._characters = filteredCharacters;
    }
  }
}
