import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Location } from '../locations/entities/location.entity';

function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface CollectorWithLocation {
  collector: User;
  location: Location;
}

@Processor('waste-pickup')
@Injectable()
export class WastePickupProcessor extends WorkerHost {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, location, waste } = job.data;

    const collectors = await this.userRepository.find({
      where: { role: 'COLLECTOR' },
    });

    // Important: explicitly type the array!
    const availableCollectors: CollectorWithLocation[] = [];
    for (const collector of collectors) {
      const loc = await this.locationRepository.findOne({
        where: { user: collector, is_primary: true },
      });
      if (loc && loc.latitude && loc.longitude) {
        availableCollectors.push({ collector, location: loc });
      }
    }

    // For demo, use fixed pickup lat/lon. Replace with job.data values for dynamic.
    const requestLat = 6.4281,
      requestLng = 3.4219;
    let minDistance = Infinity,
      assigned: CollectorWithLocation | null = null;
    for (const entry of availableCollectors) {
      const dist = haversine(
        Number(entry.location.latitude),
        Number(entry.location.longitude),
        requestLat,
        requestLng,
      );
      if (dist < minDistance) {
        minDistance = dist;
        assigned = entry;
      }
    }

    let assignment: {
      collectorId: string;
      collectorName: string;
      collectorLocation: string;
      distanceKm: number;
    } | null = null;
    if (assigned) {
      assignment = {
        collectorId: assigned.collector.user_id,
        collectorName: assigned.collector.full_name,
        collectorLocation: assigned.location.address,
        distanceKm: minDistance,
      };
    }

    return {
      scheduled: true,
      assigned: assignment,
      requestedPickup: { lat: requestLat, lng: requestLng },
      jobData: job.data,
    };
  }
}
