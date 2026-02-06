import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { user_id, ...locationData } = createLocationDto;

    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // If this is set as primary, unset other primary locations for this user
    if (locationData.is_primary) {
      await this.locationRepository.update(
        { user: { user_id }, is_primary: true },
        { is_primary: false },
      );
    }

    const location = this.locationRepository.create({
      ...locationData,
      user: user || undefined,
    });

    return await this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { location_id: id },
      relations: ['user'],
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async findByUser(userId: string): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user'],
      order: { is_primary: 'DESC', created_at: 'DESC' },
    });
  }

  async findPrimaryByUser(userId: string): Promise<Location | null> {
    return await this.locationRepository.findOne({
      where: {
        user: { user_id: userId },
        is_primary: true,
        is_active: true,
      },
      relations: ['user'],
    });
  }

  async findByLocationType(locationType: string): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { location_type: locationType as any },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<Location[]> {
    // Using Haversine formula to find locations within radius
    const query = `
      SELECT *, 
      (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
      sin(radians(latitude)))) AS distance
      FROM locations 
      WHERE latitude IS NOT NULL 
      AND longitude IS NOT NULL 
      AND is_active = true
      HAVING distance < $3
      ORDER BY distance
    `;

    return await this.locationRepository.query(query, [
      latitude,
      longitude,
      radiusKm,
    ]);
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);

    const { user_id, ...updateData } = updateLocationDto;

    // Prepare update object
    const updateObject: any = {
      ...updateData,
      updated_at: new Date(),
    };

    // If user_id is provided, verify user exists
    if (user_id) {
      const user = await this.userRepository.findOne({
        where: { user_id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
      updateObject.user = user || undefined;
    }

    // If this is set as primary, unset other primary locations for this user
    if (updateData.is_primary) {
      await this.locationRepository.update(
        { user: { user_id: location.user.user_id }, is_primary: true },
        { is_primary: false },
      );
    }

    await this.locationRepository.update(id, updateObject);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }

  async setPrimary(id: string): Promise<Location> {
    const location = await this.findOne(id);

    // Unset other primary locations for this user
    await this.locationRepository.update(
      { user: { user_id: location.user.user_id }, is_primary: true },
      { is_primary: false },
    );

    // Set this location as primary
    await this.locationRepository.update(id, { is_primary: true });

    return await this.findOne(id);
  }

  async toggleActive(id: string): Promise<Location> {
    const location = await this.findOne(id);
    await this.locationRepository.update(id, {
      is_active: !location.is_active,
      updated_at: new Date(),
    });

    return await this.findOne(id);
  }

  async calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): Promise<number> {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
