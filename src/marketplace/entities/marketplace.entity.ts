import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('marketplaces')
export class Marketplace {
  @PrimaryGeneratedColumn('uuid')
  marketplace_id: string;

  @Column()
  item_name: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User)
  seller: User;

  @ManyToOne(() => User, { nullable: true })
  buyer: User;

  @Column({ default: 'LISTED' })
  status: 'LISTED' | 'SOLD' | 'CANCELLED';

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  date_listed: Date;
}
