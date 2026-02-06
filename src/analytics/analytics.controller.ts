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
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create analytics record' })
  @ApiResponse({ status: 201, description: 'Analytics record created successfully' })
  @ApiBody({ type: CreateAnalyticsDto })
  create(@Body() createAnalyticsDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createAnalyticsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analytics records' })
  @ApiResponse({ status: 200, description: 'List of all analytics records' })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get('aggregated')
  @ApiOperation({ summary: 'Get aggregated metrics' })
  @ApiResponse({ status: 200, description: 'Aggregated metrics data' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // cache aggregated metrics for 60 seconds
  getAggregatedMetrics() {
    return this.analyticsService.getAggregatedMetrics();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get analytics by user ID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'List of user analytics records' })
  findByUser(@Param('userId') userId: string) {
    return this.analyticsService.findByUser(userId);
  }

  @Get('metric/:metric')
  @ApiOperation({ summary: 'Get analytics by metric name' })
  @ApiParam({ name: 'metric', description: 'Metric name', example: 'waste_collected_kg' })
  @ApiResponse({ status: 200, description: 'List of analytics records for metric' })
  findByMetric(@Param('metric') metric: string) {
    return this.analyticsService.findByMetric(metric);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics record by ID' })
  @ApiParam({ name: 'id', description: 'Analytics record UUID' })
  @ApiResponse({ status: 200, description: 'Analytics record found' })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update analytics record (partial)' })
  @ApiParam({ name: 'id', description: 'Analytics record UUID' })
  @ApiResponse({ status: 200, description: 'Analytics record updated successfully' })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  @ApiBody({ type: UpdateAnalyticsDto })
  update(
    @Param('id') id: string,
    @Body() updateAnalyticsDto: UpdateAnalyticsDto,
  ) {
    return this.analyticsService.update(id, updateAnalyticsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete analytics record' })
  @ApiParam({ name: 'id', description: 'Analytics record UUID' })
  @ApiResponse({ status: 200, description: 'Analytics record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  remove(@Param('id') id: string) {
    return this.analyticsService.remove(id);
  }
}
