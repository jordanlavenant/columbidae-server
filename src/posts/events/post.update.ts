import { Post } from 'generated/prisma'

export class PostEvent {
  constructor(
    public readonly type: string,
    public readonly post: Post,
  ) {}
}
