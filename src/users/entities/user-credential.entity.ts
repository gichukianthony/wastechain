import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export type CredentialType =
  | 'PASSWORD'
  | 'DID'
  | 'GOOGLE'
  | 'PASSKEY'
  | 'OTHER';

@Entity('user_credentials')
export class UserCredential {
  @PrimaryGeneratedColumn('uuid')
  credential_id: string;

  @ManyToOne(() => User, (user) => user.credentials, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'enum',
    enum: ['PASSWORD', 'DID', 'GOOGLE', 'PASSKEY', 'OTHER'],
  })
  type: CredentialType;

  @Index()
  @Column({ unique: false })
  identifier: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

