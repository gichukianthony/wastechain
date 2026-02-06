import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateMarketplaceDto } from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';
import { CreateRecycleOrderDto } from './dto/create-recycle-order.dto';
import { UpdateRecycleOrderDto } from './dto/update-recycle-order.dto';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Marketplace endpoints
  @Post()
  @ApiOperation({ summary: 'Create marketplace item' })
  @ApiResponse({ status: 201, description: 'Marketplace item created successfully' })
  @ApiBody({ type: CreateMarketplaceDto })
  create(@Body() createMarketplaceDto: CreateMarketplaceDto) {
    return this.marketplaceService.create(createMarketplaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all marketplace items' })
  @ApiResponse({ status: 200, description: 'List of all marketplace items' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30) // cache marketplace listing for 30 seconds
  findAll() {
    return this.marketplaceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get marketplace item by ID' })
  @ApiParam({ name: 'id', description: 'Marketplace item UUID' })
  @ApiResponse({ status: 200, description: 'Marketplace item found' })
  @ApiResponse({ status: 404, description: 'Marketplace item not found' })
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update marketplace item (partial)' })
  @ApiParam({ name: 'id', description: 'Marketplace item UUID' })
  @ApiResponse({ status: 200, description: 'Marketplace item updated successfully' })
  @ApiResponse({ status: 404, description: 'Marketplace item not found' })
  @ApiBody({ type: UpdateMarketplaceDto })
  update(
    @Param('id') id: string,
    @Body() updateMarketplaceDto: UpdateMarketplaceDto,
  ) {
    return this.marketplaceService.update(id, updateMarketplaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete marketplace item' })
  @ApiParam({ name: 'id', description: 'Marketplace item UUID' })
  @ApiResponse({ status: 200, description: 'Marketplace item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Marketplace item not found' })
  remove(@Param('id') id: string) {
    return this.marketplaceService.remove(id);
  }

  // RecyclerOrder endpoints
  @Post('orders')
  @ApiOperation({ summary: 'Create recycler order' })
  @ApiResponse({ status: 201, description: 'Recycler order created successfully' })
  @ApiBody({ type: CreateRecycleOrderDto })
  createOrder(@Body() createRecycleOrderDto: CreateRecycleOrderDto) {
    return this.marketplaceService.createOrder(createRecycleOrderDto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all recycler orders' })
  @ApiResponse({ status: 200, description: 'List of all recycler orders' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  findAllOrders() {
    return this.marketplaceService.findAllOrders();
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get recycler order by ID' })
  @ApiParam({ name: 'id', description: 'Recycler order UUID' })
  @ApiResponse({ status: 200, description: 'Recycler order found' })
  @ApiResponse({ status: 404, description: 'Recycler order not found' })
  findOneOrder(@Param('id') id: string) {
    return this.marketplaceService.findOneOrder(id);
  }

  @Patch('orders/:id')
  @ApiOperation({ summary: 'Update recycler order (partial)' })
  @ApiParam({ name: 'id', description: 'Recycler order UUID' })
  @ApiResponse({ status: 200, description: 'Recycler order updated successfully' })
  @ApiResponse({ status: 404, description: 'Recycler order not found' })
  @ApiBody({ type: UpdateRecycleOrderDto })
  updateOrder(
    @Param('id') id: string,
    @Body() updateRecycleOrderDto: UpdateRecycleOrderDto,
  ) {
    return this.marketplaceService.updateOrder(id, updateRecycleOrderDto);
  }

  @Delete('orders/:id')
  @ApiOperation({ summary: 'Delete recycler order' })
  @ApiParam({ name: 'id', description: 'Recycler order UUID' })
  @ApiResponse({ status: 200, description: 'Recycler order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Recycler order not found' })
  removeOrder(@Param('id') id: string) {
    return this.marketplaceService.removeOrder(id);
  }
}
