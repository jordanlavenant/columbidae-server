import { Post } from 'generated/prisma/browser'

export class PostEvent {
  constructor(
    public readonly type: string,
    public readonly post: Post,
  ) {}
}
