import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { GoogleMapsService } from './google-maps.service';
import { Location } from './entities/location.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, User])],
  controllers: [LocationsController],
  providers: [LocationsService, GoogleMapsService],
  exports: [LocationsService, GoogleMapsService],
})
export class LocationsModule { }