import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMarketplaceDto } from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';
import { CreateRecycleOrderDto } from './dto/create-recycle-order.dto';
import { UpdateRecycleOrderDto } from './dto/update-recycle-order.dto';
import { Marketplace } from './entities/marketplace.entity';
import { RecyclerOrder } from './entities/recycle-order.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Marketplace)
    private readonly marketplaceRepository: Repository<Marketplace>,
    @InjectRepository(RecyclerOrder)
    private readonly recyclerOrderRepository: Repository<RecyclerOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Marketplace CRUD operations
  async create(
    createMarketplaceDto: CreateMarketplaceDto,
  ): Promise<Marketplace> {
    const seller = await this.userRepository.findOne({
      where: { user_id: createMarketplaceDto.seller },
    });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    let buyer: User | null = null;
    if (createMarketplaceDto.buyer) {
      buyer = await this.userRepository.findOne({
        where: { user_id: createMarketplaceDto.buyer },
      });
      if (!buyer) {
        throw new NotFoundException('Buyer not found');
      }
    }

    const marketplace = this.marketplaceRepository.create({
      item_name: createMarketplaceDto.item_name,
      price: createMarketplaceDto.price,
      description: createMarketplaceDto.description,
      seller: seller,
      buyer: buyer || undefined,
      status: createMarketplaceDto.status,
    });

    return await this.marketplaceRepository.save(marketplace);
  }

  async findAll(): Promise<Marketplace[]> {
    return await this.marketplaceRepository.find({
      relations: ['seller', 'buyer'],
      order: { date_listed: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Marketplace> {
    const marketplace = await this.marketplaceRepository.findOne({
      where: { marketplace_id: id },
      relations: ['seller', 'buyer'],
    });
    if (!marketplace) throw new NotFoundException('Marketplace item not found');
    return marketplace;
  }

  async update(
    id: string,
    updateMarketplaceDto: UpdateMarketplaceDto,
  ): Promise<Marketplace> {
    const marketplace = await this.findOne(id);

    if (updateMarketplaceDto.seller) {
      const seller = await this.userRepository.findOne({
        where: { user_id: updateMarketplaceDto.seller },
      });
      if (!seller) throw new NotFoundException('Seller not found');
      marketplace.seller = seller;
    }

    if (updateMarketplaceDto.buyer) {
      const buyer = await this.userRepository.findOne({
        where: { user_id: updateMarketplaceDto.buyer },
      });
      if (!buyer) throw new NotFoundException('Buyer not found');
      marketplace.buyer = buyer;
    }

    Object.assign(marketplace, updateMarketplaceDto);
    return await this.marketplaceRepository.save(marketplace);
  }

  async remove(id: string): Promise<void> {
    const marketplace = await this.findOne(id);
    await this.marketplaceRepository.remove(marketplace);
  }

  // RecyclerOrder CRUD operations
  async createOrder(
    createRecycleOrderDto: CreateRecycleOrderDto,
  ): Promise<RecyclerOrder> {
    const recycler = await this.userRepository.findOne({
      where: { user_id: createRecycleOrderDto.recycler },
    });
    if (!recycler) {
      throw new NotFoundException('Recycler not found');
    }

    const recyclerOrder = this.recyclerOrderRepository.create({
      recycler: recycler,
      material_type: createRecycleOrderDto.material_type,
      required_quantity_kg: createRecycleOrderDto.required_quantity_kg,
      status: createRecycleOrderDto.status,
    });

    return await this.recyclerOrderRepository.save(recyclerOrder);
  }

  async findAllOrders(): Promise<RecyclerOrder[]> {
    return await this.recyclerOrderRepository.find({
      relations: ['recycler', 'collections'],
      order: { order_id: 'DESC' },
    });
  }

  async findOneOrder(id: string): Promise<RecyclerOrder> {
    const recyclerOrder = await this.recyclerOrderRepository.findOne({
      where: { order_id: id },
      relations: ['recycler', 'collections'],
    });
    if (!recyclerOrder) throw new NotFoundException('Recycler order not found');
    return recyclerOrder;
  }

  async updateOrder(
    id: string,
    updateRecycleOrderDto: UpdateRecycleOrderDto,
  ): Promise<RecyclerOrder> {
    const recyclerOrder = await this.findOneOrder(id);

    if (updateRecycleOrderDto.recycler) {
      const recycler = await this.userRepository.findOne({
        where: { user_id: updateRecycleOrderDto.recycler },
      });
      if (!recycler) throw new NotFoundException('Recycler not found');
      recyclerOrder.recycler = recycler;
    }

    Object.assign(recyclerOrder, updateRecycleOrderDto);
    return await this.recyclerOrderRepository.save(recyclerOrder);
  }

  async removeOrder(id: string): Promise<void> {
    const recyclerOrder = await this.findOneOrder(id);
    await this.recyclerOrderRepository.remove(recyclerOrder);
  }
}
