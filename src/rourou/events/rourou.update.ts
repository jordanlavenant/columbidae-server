import { Rourou } from 'generated/prisma/browser'

export enum RourouEventType {
  RourouCreated = 'RourouCreated',
  RourouUpdated = 'RourouUpdated',
  RourouDeleted = 'RourouDeleted',
}

export class RourouEvent {
  constructor(
    public readonly type: RourouEventType,
    public readonly rourou: Rourou,
  ) {}
}
