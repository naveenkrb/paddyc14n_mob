import { Reading } from './reading';

export class Character {
  characterId: number;
  characterCode: string;
  characterName: string;
  characterStage: string;
  characterType: string;
  characterReadings?: Reading[];
  captureImage: boolean;
}
