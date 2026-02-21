import { Comment } from 'generated/prisma/browser'

export enum CommentEventType {
  CREATED = 'CommentCreated',
  UPDATED = 'CommentUpdated',
  DELETED = 'CommentDeleted',
}

export class CommentEvent {
  constructor(
    public readonly type: CommentEventType,
    public readonly comment: Comment,
  ) {}
}
