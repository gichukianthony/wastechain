import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  analytics_id: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column()
  metric: string;

  @Column('decimal')
  value: number;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  date_recorded: Date;
}
