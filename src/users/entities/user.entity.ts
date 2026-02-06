import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WasteRequest } from 'src/waste/entities/waste-request.entity';
import { Location } from 'src/locations/entities/location.entity';
import { UserCredential } from './user-credential.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['HOUSEHOLD', 'COLLECTOR', 'RECYCLER', 'ADMIN'],
  })
  role: 'HOUSEHOLD' | 'COLLECTOR' | 'RECYCLER' | 'ADMIN';

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 0 })
  green_points: number;

  @OneToMany(() => WasteRequest, (req) => req.user)
  waste_requests: WasteRequest[];

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @OneToMany(() => UserCredential, (credential) => credential.user, {
    cascade: true,
  })
  credentials: UserCredential[];

  @Column({ nullable: true })
  authenticator_secret?: string;
}
