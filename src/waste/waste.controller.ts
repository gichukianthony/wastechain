import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { CreateWasteRequestDto } from './dto/create-waste-request.dto';
import { UpdateWasteRequestDto } from './dto/update-waste-request.dto';

@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post()
  create(@Body() createWasteDto: CreateWasteDto) {
    return this.wasteService.create(createWasteDto);
  }

  @Get()
  findAll() {
    return this.wasteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wasteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWasteDto: UpdateWasteDto) {
    return this.wasteService.update(id, updateWasteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wasteService.remove(id);
  }

  // WasteRequest endpoints
  @Post('requests')
  createRequest(@Body() createWasteRequestDto: CreateWasteRequestDto) {
    return this.wasteService.createRequest(createWasteRequestDto);
  }

  @Get('requests')
  findAllRequests() {
    return this.wasteService.findAllRequests();
  }

  @Get('requests/:id')
  findOneRequest(@Param('id') id: string) {
    return this.wasteService.findOneRequest(id);
  }

  @Patch('requests/:id')
  updateRequest(
    @Param('id') id: string,
    @Body() updateWasteRequestDto: UpdateWasteRequestDto,
  ) {
    return this.wasteService.updateRequest(id, updateWasteRequestDto);
  }

  @Delete('requests/:id')
  removeRequest(@Param('id') id: string) {
    return this.wasteService.removeRequest(id);
  }
}
