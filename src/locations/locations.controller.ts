import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseFloatPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { GoogleMapsService } from './google-maps.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly googleMapsService: GoogleMapsService,
  ) { }

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.locationsService.findByUser(userId);
  }

  @Get('user/:userId/primary')
  findPrimaryByUser(@Param('userId') userId: string) {
    return this.locationsService.findPrimaryByUser(userId);
  }

  @Get('type/:locationType')
  findByLocationType(@Param('locationType') locationType: string) {
    return this.locationsService.findByLocationType(locationType);
  }

  @Get('nearby')
  findNearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', ParseIntPipe) radius: number = 10,
  ) {
    return this.locationsService.findNearby(latitude, longitude, radius);
  }

  @Get('distance')
  calculateDistance(
    @Query('lat1', ParseFloatPipe) lat1: number,
    @Query('lon1', ParseFloatPipe) lon1: number,
    @Query('lat2', ParseFloatPipe) lat2: number,
    @Query('lon2', ParseFloatPipe) lon2: number,
  ) {
    return this.locationsService.calculateDistance(lat1, lon1, lat2, lon2);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Patch(':id/set-primary')
  setPrimary(@Param('id') id: string) {
    return this.locationsService.setPrimary(id);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.locationsService.toggleActive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }

  // Google Maps Integration Endpoints

  @Get('google/live-location')
  getLiveLocationFromCoordinates(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    return this.googleMapsService.getLiveLocationFromCoordinates(latitude, longitude);
  }

  @Get('google/coordinates')
  getCoordinatesFromAddress(@Query('address') address: string) {
    return this.googleMapsService.getCoordinatesFromAddress(address);
  }

  @Get('google/places/search')
  searchPlaces(
    @Query('query') query: string,
    @Query('latitude', ParseFloatPipe) latitude?: number,
    @Query('longitude', ParseFloatPipe) longitude?: number,
    @Query('radius', ParseIntPipe) radius?: number,
  ) {
    const location = latitude && longitude ? { lat: latitude, lng: longitude } : undefined;
    return this.googleMapsService.searchPlaces(query, location, radius);
  }

  @Get('google/places/:placeId')
  getPlaceDetails(@Param('placeId') placeId: string) {
    return this.googleMapsService.getPlaceDetails(placeId);
  }

  @Get('google/distance')
  calculateDistanceAndDuration(
    @Query('originLat', ParseFloatPipe) originLat: number,
    @Query('originLng', ParseFloatPipe) originLng: number,
    @Query('destLat', ParseFloatPipe) destLat: number,
    @Query('destLng', ParseFloatPipe) destLng: number,
  ) {
    return this.googleMapsService.calculateDistanceAndDuration(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng },
    );
  }

  @Post('google/create-from-coordinates')
  createFromCoordinates(
    @Body() body: { latitude: number; longitude: number; user_id: string; location_type?: string },
  ) {
    return this.googleMapsService.getLiveLocationFromCoordinates(body.latitude, body.longitude)
      .then(locationData => {
        const createLocationDto: CreateLocationDto = {
          address: locationData.formatted_address,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          postal_code: locationData.postal_code,
          latitude: locationData.lat,
          longitude: locationData.lng,
          location_type: body.location_type || 'OTHER',
          user_id: body.user_id,
        };
        return this.locationsService.create(createLocationDto);
      });
  }

  @Post('google/create-from-address')
  createFromAddress(
    @Body() body: { address: string; user_id: string; location_type?: string },
  ) {
    return this.googleMapsService.getCoordinatesFromAddress(body.address)
      .then(locationData => {
        const createLocationDto: CreateLocationDto = {
          address: locationData.formatted_address,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          postal_code: locationData.postal_code,
          latitude: locationData.lat,
          longitude: locationData.lng,
          location_type: body.location_type || 'OTHER',
          user_id: body.user_id,
        };
        return this.locationsService.create(createLocationDto);
      });
  }
}