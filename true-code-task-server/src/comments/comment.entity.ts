import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentFile } from './comment-file.entity';

@Entity('Comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;
  @Column()
  author: string;
  @Column()
  message: string;
  @Column({ type: 'timestamp' })
  publish_at: Date;

  @OneToMany(() => CommentFile, (file) => file.comment)
  files: CommentFile[];
}
