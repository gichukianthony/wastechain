import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { Waste } from './entities/waste.entity';
import { WasteRequest } from './entities/waste-request.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Waste, WasteRequest, User])],
  controllers: [WasteController],
  providers: [WasteService],
  exports: [WasteService],
})
export class WasteModule {}
