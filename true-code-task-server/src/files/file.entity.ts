import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Files')
export class File extends BaseEntity{
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  filename: string;
  @Column({ name: 'mime_type' })
  mimeType: string;
}
