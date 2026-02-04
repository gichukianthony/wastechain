import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Index({ unique: true })
  @Column()
  token: string;

  @Column('timestamptz')
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

