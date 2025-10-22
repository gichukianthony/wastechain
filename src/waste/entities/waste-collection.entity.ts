import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WasteRequest } from 'src/waste/entities/waste-request.entity';
import { RecyclerOrder } from 'src/marketplace/entities/recycle-order.entity';

@Entity('waste_collections')
export class WasteCollection {
  @PrimaryGeneratedColumn('uuid')
  collection_id: string;

  @ManyToOne(() => WasteRequest, { nullable: false })
  request: WasteRequest;

  @ManyToOne(() => RecyclerOrder, { nullable: true })
  recycler_order: RecyclerOrder;

  @ManyToOne(() => User, { nullable: false })
  collector: User;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  collected_at: Date;

  @Column('decimal')
  weight_kg: number;

  @Column({ default: 'VERIFIED' })
  status: 'VERIFIED' | 'REJECTED';
}
