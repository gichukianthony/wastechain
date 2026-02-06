import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  auth_id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  hashed_refresh_token: string;

  @Column({
    type: 'enum',
    enum: ['LOCAL', 'GOOGLE', 'FACEBOOK', 'WHATSAPP', 'AUTHENTICATOR'],
    default: 'LOCAL',
  })
  provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'WHATSAPP' | 'AUTHENTICATOR';

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  last_login: Date;
}
