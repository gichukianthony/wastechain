import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create reward' })
  @ApiResponse({ status: 201, description: 'Reward created successfully' })
  @ApiBody({ type: CreateRewardDto })
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rewards' })
  @ApiResponse({ status: 200, description: 'List of all rewards' })
  findAll() {
    return this.rewardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward by ID' })
  @ApiParam({ name: 'id', description: 'Reward UUID' })
  @ApiResponse({ status: 200, description: 'Reward found' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reward (partial)' })
  @ApiParam({ name: 'id', description: 'Reward UUID' })
  @ApiResponse({ status: 200, description: 'Reward updated successfully' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @ApiBody({ type: UpdateRewardDto })
  update(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardsService.update(id, updateRewardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reward' })
  @ApiParam({ name: 'id', description: 'Reward UUID' })
  @ApiResponse({ status: 200, description: 'Reward deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  remove(@Param('id') id: string) {
    return this.rewardsService.remove(id);
  }
}
