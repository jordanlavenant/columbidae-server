import { Comment } from 'generated/prisma/browser'

export class CommentEvent {
  constructor(
    public readonly type: string,
    public readonly comment: Comment,
  ) {}
}
