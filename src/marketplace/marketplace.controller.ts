import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateMarketplaceDto } from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';
import { CreateRecycleOrderDto } from './dto/create-recycle-order.dto';
import { UpdateRecycleOrderDto } from './dto/update-recycle-order.dto';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Marketplace endpoints
  @Post()
  create(@Body() createMarketplaceDto: CreateMarketplaceDto) {
    return this.marketplaceService.create(createMarketplaceDto);
  }

  @Get()
  findAll() {
    return this.marketplaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketplaceDto: UpdateMarketplaceDto,
  ) {
    return this.marketplaceService.update(id, updateMarketplaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketplaceService.remove(id);
  }

  // RecyclerOrder endpoints
  @Post('orders')
  createOrder(@Body() createRecycleOrderDto: CreateRecycleOrderDto) {
    return this.marketplaceService.createOrder(createRecycleOrderDto);
  }

  @Get('orders')
  findAllOrders() {
    return this.marketplaceService.findAllOrders();
  }

  @Get('orders/:id')
  findOneOrder(@Param('id') id: string) {
    return this.marketplaceService.findOneOrder(id);
  }

  @Patch('orders/:id')
  updateOrder(
    @Param('id') id: string,
    @Body() updateRecycleOrderDto: UpdateRecycleOrderDto,
  ) {
    return this.marketplaceService.updateOrder(id, updateRecycleOrderDto);
  }

  @Delete('orders/:id')
  removeOrder(@Param('id') id: string) {
    return this.marketplaceService.removeOrder(id);
  }
}
