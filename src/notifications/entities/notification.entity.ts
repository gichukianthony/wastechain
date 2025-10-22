import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notification_id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({
    type: 'enum',
    enum: ['REWARD', 'MARKETPLACE', 'WASTE', 'GENERAL'],
    default: 'GENERAL',
  })
  notification_type: 'REWARD' | 'MARKETPLACE' | 'WASTE' | 'GENERAL';

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  date_sent: Date;
}
