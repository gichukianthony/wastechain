import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { CreateWasteRequestDto } from './dto/create-waste-request.dto';
import { UpdateWasteRequestDto } from './dto/update-waste-request.dto';
import { Waste } from './entities/waste.entity';
import { WasteRequest } from './entities/waste-request.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WasteService {
  constructor(
    @InjectRepository(Waste)
    private readonly wasteRepository: Repository<Waste>,
    @InjectRepository(WasteRequest)
    private readonly wasteRequestRepository: Repository<WasteRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createWasteDto: CreateWasteDto): Promise<Waste> {
    const owner = await this.userRepository.findOne({
      where: { user_id: createWasteDto.owner },
    });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const waste = this.wasteRepository.create({
      type: createWasteDto.type,
      weight_kg: createWasteDto.weight_kg,
      owner: owner,
      description: createWasteDto.description,
    });

    return await this.wasteRepository.save(waste);
  }

  async findAll(): Promise<Waste[]> {
    return await this.wasteRepository.find({
      relations: ['owner'],
      order: { date_created: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Waste> {
    const waste = await this.wasteRepository.findOne({
      where: { waste_id: id },
      relations: ['owner'],
    });
    if (!waste) throw new NotFoundException('Waste not found');
    return waste;
  }

  async update(id: string, updateWasteDto: UpdateWasteDto): Promise<Waste> {
    const waste = await this.findOne(id);

    if (updateWasteDto.owner) {
      const owner = await this.userRepository.findOne({
        where: { user_id: updateWasteDto.owner },
      });
      if (!owner) throw new NotFoundException('Owner not found');
      waste.owner = owner;
    }

    Object.assign(waste, updateWasteDto);
    return await this.wasteRepository.save(waste);
  }

  async remove(id: string): Promise<void> {
    const waste = await this.findOne(id);
    await this.wasteRepository.remove(waste);
  }

  // WasteRequest CRUD operations
  async createRequest(
    createWasteRequestDto: CreateWasteRequestDto,
  ): Promise<WasteRequest> {
    const user = await this.userRepository.findOne({
      where: { user_id: createWasteRequestDto.user },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let collector: User | null = null;
    if (createWasteRequestDto.collector) {
      collector = await this.userRepository.findOne({
        where: { user_id: createWasteRequestDto.collector },
      });
      if (!collector) {
        throw new NotFoundException('Collector not found');
      }
    }

    const wasteRequest = this.wasteRequestRepository.create({
      user: user,
      waste_type: createWasteRequestDto.waste_type,
      status: createWasteRequestDto.status,
      collector: collector || undefined,
      weight_kg: createWasteRequestDto.weight_kg,
      pickup_time: createWasteRequestDto.pickup_time,
    });

    return await this.wasteRequestRepository.save(wasteRequest);
  }

  async findAllRequests(): Promise<WasteRequest[]> {
    return await this.wasteRequestRepository.find({
      relations: ['user', 'collector'],
      order: { request_date: 'DESC' },
    });
  }

  async findOneRequest(id: string): Promise<WasteRequest> {
    const wasteRequest = await this.wasteRequestRepository.findOne({
      where: { request_id: id },
      relations: ['user', 'collector'],
    });
    if (!wasteRequest) throw new NotFoundException('Waste request not found');
    return wasteRequest;
  }

  async updateRequest(
    id: string,
    updateWasteRequestDto: UpdateWasteRequestDto,
  ): Promise<WasteRequest> {
    const wasteRequest = await this.findOneRequest(id);

    if (updateWasteRequestDto.user) {
      const user = await this.userRepository.findOne({
        where: { user_id: updateWasteRequestDto.user },
      });
      if (!user) throw new NotFoundException('User not found');
      wasteRequest.user = user;
    }

    if (updateWasteRequestDto.collector) {
      const collector = await this.userRepository.findOne({
        where: { user_id: updateWasteRequestDto.collector },
      });
      if (!collector) throw new NotFoundException('Collector not found');
      wasteRequest.collector = collector;
    }

    Object.assign(wasteRequest, updateWasteRequestDto);
    return await this.wasteRequestRepository.save(wasteRequest);
  }

  async removeRequest(id: string): Promise<void> {
    const wasteRequest = await this.findOneRequest(id);
    await this.wasteRequestRepository.remove(wasteRequest);
  }
}
