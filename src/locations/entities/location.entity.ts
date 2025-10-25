import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    location_id: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    postal_code: string;

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    longitude: number;

    @Column({ nullable: true })
    landmark: string;

    @Column({ nullable: true })
    instructions: string;

    @Column({
        type: 'enum',
        enum: ['HOME', 'OFFICE', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER'],
        default: 'HOME'
    })
    location_type: 'HOME' | 'OFFICE' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER';

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    is_primary: boolean;

    @ManyToOne(() => User, { nullable: false })
    user: User;

    @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}