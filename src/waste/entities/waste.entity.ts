import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('wastes')
export class Waste {
  @PrimaryGeneratedColumn('uuid')
  waste_id: string;

  @Column({
    type: 'enum',
    enum: ['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'],
  })
  type: string;

  @Column('decimal')
  weight_kg: number;

  @ManyToOne(() => User)
  owner: User;

  @Column({ nullable: true })
  description: string;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;
}
