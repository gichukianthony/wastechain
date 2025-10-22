import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  reward_id: string;

  @ManyToOne(() => User)
  user: User;

  @Column('int') points_earned: number;
  @Column() description: string;
  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  date_awarded: Date;
}
