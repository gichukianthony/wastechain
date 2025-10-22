import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('waste_requests')
export class WasteRequest {
  @PrimaryGeneratedColumn('uuid')
  request_id: string;

  @ManyToOne(() => User, (user) => user.waste_requests, { nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: ['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'],
  })
  waste_type: string;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'ASSIGNED' | 'COLLECTED' | 'COMPLETED';

  @ManyToOne(() => User, { nullable: true })
  collector: User;

  @Column('decimal', { nullable: true })
  weight_kg: number;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  request_date: Date;

  @Column({ nullable: true })
  pickup_time: string;
}
