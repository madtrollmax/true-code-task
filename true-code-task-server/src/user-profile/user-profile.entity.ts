import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('UserProfiles')
export class UserProfile extends BaseEntity {
  @PrimaryColumn()
  login: string;
  @Column({ name: 'first_name' })
  firstname?: string;
  @Column({ name: 'last_name' })
  lastname?: string;
  @Column()
  info?: string;
  @Column()
  email?: string;
  @Column()
  phone?: string;
  @Column({ name: 'file', type: 'uuid', nullable: true })
  fileId?: string;
}
