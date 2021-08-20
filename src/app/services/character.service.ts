/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceUrl } from '../common/service-url';
import { Character } from '../data/character';
import { Reading } from '../data/reading';
import { StorageService } from './storage.service';
import { ServiceBase } from './service-base';
import { StorageKeys } from '../common/storage-keys';
import { tap } from 'rxjs/operators';

export interface CharacterData {
  characterId: string;
  characterCode: string;
  characterName: string;
  characterStage: string;
  characterType: string;
  readingName?: string[];
  readingImage?: string[];
  readingImageMimeType?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService extends ServiceBase {
  private _characters: Map<number, Character>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService) {
    super();
    this._characters = new Map<number, Character>();
  }

  private static getCharacterReadingImageUrl(image: string, mimeType: string) {
    return image ?
      'data:' + mimeType + ';base64,' + image : '../../assets/images/character.png';
  }

  initializeData(data: CharacterData[] = null) {
    if (data != null) {
      this._characters.clear();
      data.forEach(d => {
        const c = this.getCharacterFromData(d);
        this._characters.set(c.characterId, c);
      });
      this.storeCharacters();
    } else {
      const cached = this.storageService.get(StorageKeys.characters);
      if (cached) {
        this._characters = new Map(JSON.parse(cached));
      } else {
        console.log('No characters in cache');
      }
    }
  }

  find(characterId: number) {
    return this._characters.get(characterId);
  }

  findByCharacterCode(characterCode: string) {
    return [...this._characters].find(([k, v]) => v.characterCode === characterCode)[1];
  }

  get characters() {
    return this._characters;
  }

  getCharacterFromData(data: CharacterData) {
    const character = new Character();
    character.characterId = +data.characterId;
    character.characterCode = data.characterCode;
    character.characterName = data.characterName;
    character.characterStage = data.characterStage;
    character.characterType = data.characterType;

    if (character.characterType === 'S') {
      character.characterReadings = [];
      for (let index = 0; index < data.readingName.length; index++) {
        const reading = new Reading();
        reading.readingName = data.readingName[index];
        reading.readingImage = CharacterService.getCharacterReadingImageUrl(data.readingImage[index], data.readingImageMimeType[index]);
        character.characterReadings.push(reading);
      }
    }

    return character;
  }

  synchronizeCharacterData() {
    return this.http
      .get<CharacterData[]>(this.getServiceUrl(ServiceUrl.characterData))
      .pipe(
        tap(
          data => this.initializeData(data),
          error => {
            this.initializeData();
            throw error;
          }
        )
      );
  }

  private storeCharacters() {
    this.storageService.set(StorageKeys.characters, JSON.stringify([...this._characters.entries()]));
  }
}
