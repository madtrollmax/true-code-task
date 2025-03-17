import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity('CommentFiles')
export class CommentFile extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', name: 'fileId' })
  fileId!: string;
  @PrimaryColumn()
  commentId: number;
  @ManyToOne((type) => Comment)
  comment: Comment;
}
