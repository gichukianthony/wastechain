import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
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
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { CreateWasteRequestDto } from './dto/create-waste-request.dto';
import { UpdateWasteRequestDto } from './dto/update-waste-request.dto';
import { Queue } from 'bullmq';

@ApiTags('waste')
@Controller('waste')
export class WasteController {
  constructor(
    private readonly wasteService: WasteService,
    @Inject('WASTE_PICKUP_QUEUE') private readonly wastePickupQueue: Queue,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create waste record' })
  @ApiResponse({ status: 201, description: 'Waste created successfully' })
  @ApiBody({ type: CreateWasteDto })
  create(@Body() createWasteDto: CreateWasteDto) {
    return this.wasteService.create(createWasteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all waste records' })
  @ApiResponse({ status: 200, description: 'List of all waste records' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  findAll() {
    return this.wasteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get waste by ID' })
  @ApiParam({ name: 'id', description: 'Waste UUID' })
  @ApiResponse({ status: 200, description: 'Waste found' })
  @ApiResponse({ status: 404, description: 'Waste not found' })
  findOne(@Param('id') id: string) {
    return this.wasteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update waste (partial)' })
  @ApiParam({ name: 'id', description: 'Waste UUID' })
  @ApiResponse({ status: 200, description: 'Waste updated successfully' })
  @ApiResponse({ status: 404, description: 'Waste not found' })
  @ApiBody({ type: UpdateWasteDto })
  update(@Param('id') id: string, @Body() updateWasteDto: UpdateWasteDto) {
    return this.wasteService.update(id, updateWasteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete waste' })
  @ApiParam({ name: 'id', description: 'Waste UUID' })
  @ApiResponse({ status: 200, description: 'Waste deleted successfully' })
  @ApiResponse({ status: 404, description: 'Waste not found' })
  remove(@Param('id') id: string) {
    return this.wasteService.remove(id);
  }

  // WasteRequest endpoints
  @Post('requests')
  @ApiOperation({ summary: 'Create waste pickup request' })
  @ApiResponse({ status: 201, description: 'Waste request created successfully' })
  @ApiBody({ type: CreateWasteRequestDto })
  createRequest(@Body() createWasteRequestDto: CreateWasteRequestDto) {
    return this.wasteService.createRequest(createWasteRequestDto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get all waste requests' })
  @ApiResponse({ status: 200, description: 'List of all waste requests' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  findAllRequests() {
    return this.wasteService.findAllRequests();
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get waste request by ID' })
  @ApiParam({ name: 'id', description: 'Waste request UUID' })
  @ApiResponse({ status: 200, description: 'Waste request found' })
  @ApiResponse({ status: 404, description: 'Waste request not found' })
  findOneRequest(@Param('id') id: string) {
    return this.wasteService.findOneRequest(id);
  }

  @Patch('requests/:id')
  @ApiOperation({ summary: 'Update waste request (partial)' })
  @ApiParam({ name: 'id', description: 'Waste request UUID' })
  @ApiResponse({ status: 200, description: 'Waste request updated successfully' })
  @ApiResponse({ status: 404, description: 'Waste request not found' })
  @ApiBody({ type: UpdateWasteRequestDto })
  updateRequest(
    @Param('id') id: string,
    @Body() updateWasteRequestDto: UpdateWasteRequestDto,
  ) {
    return this.wasteService.updateRequest(id, updateWasteRequestDto);
  }

  @Delete('requests/:id')
  @ApiOperation({ summary: 'Delete waste request' })
  @ApiParam({ name: 'id', description: 'Waste request UUID' })
  @ApiResponse({ status: 200, description: 'Waste request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Waste request not found' })
  removeRequest(@Param('id') id: string) {
    return this.wasteService.removeRequest(id);
  }

  @Post('schedule-pickup')
  @ApiOperation({ summary: 'Schedule waste pickup job' })
  @ApiResponse({ status: 201, description: 'Pickup job scheduled successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c' },
        location: { type: 'string', example: 'Lagos, NG' },
        waste: { type: 'number', example: 5 },
      },
      required: ['userId', 'location', 'waste'],
    },
  })
  async schedulePickup(
    @Body() body: { userId: string; location: string; waste: number },
  ) {
    const job = await this.wastePickupQueue.add('pickup', body);
    return { jobId: job.id, state: 'scheduled' };
  }
}
