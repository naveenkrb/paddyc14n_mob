export class Observation {
  observationId?: number;
  planId: number;
  characterId: number;
  observation: string;
  observationImage: string;
  observationImageMimeType?: string;
  remarks?: string;
  recordedAt?: Date;
  wipId?: string;
}
