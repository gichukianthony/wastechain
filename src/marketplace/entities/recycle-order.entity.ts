import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WasteCollection } from 'src/waste/entities/waste-collection.entity';

@Entity('recycler_orders')
export class RecyclerOrder {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @ManyToOne(() => User, { nullable: false })
  recycler: User;

  @Column()
  material_type: string; // e.g. "Plastic bottles"

  @Column('decimal')
  required_quantity_kg: number;

  @Column({ default: 'OPEN' })
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';

  @OneToMany(() => WasteCollection, (wc) => wc.recycler_order)
  collections: WasteCollection[];
}
