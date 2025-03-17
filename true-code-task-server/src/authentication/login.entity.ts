import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Logins')
export class Login extends BaseEntity {
  @PrimaryColumn()
  login: string;
  @Column()
  hash: string;
  @Column()
  salt: string;
  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string | null;
}
