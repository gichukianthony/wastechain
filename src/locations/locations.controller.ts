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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { LocationIQService } from './google-maps.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

const allowedLocationTypes = [
  'HOME',
  'OFFICE',
  'COMMERCIAL',
  'INDUSTRIAL',
  'OTHER',
] as const;
type LocationType = (typeof allowedLocationTypes)[number];
function isValidLocationType(type: any): type is LocationType {
  return allowedLocationTypes.includes(type);
}

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly locationIQService: LocationIQService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create location' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiBody({ type: CreateLocationDto })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'List of all locations' })
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get locations by user ID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'List of user locations' })
  findByUser(@Param('userId') userId: string) {
    return this.locationsService.findByUser(userId);
  }

  @Get('user/:userId/primary')
  @ApiOperation({ summary: 'Get primary location by user ID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Primary location found' })
  findPrimaryByUser(@Param('userId') userId: string) {
    return this.locationsService.findPrimaryByUser(userId);
  }

  @Get('type/:locationType')
  @ApiOperation({ summary: 'Get locations by type' })
  @ApiParam({ name: 'locationType', description: 'Location type', example: 'HOME' })
  @ApiResponse({ status: 200, description: 'List of locations by type' })
  findByLocationType(@Param('locationType') locationType: string) {
    return this.locationsService.findByLocationType(locationType);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby locations' })
  @ApiQuery({ name: 'latitude', type: Number, example: 6.4281 })
  @ApiQuery({ name: 'longitude', type: Number, example: 3.4219 })
  @ApiQuery({ name: 'radius', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of nearby locations' })
  findNearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', ParseIntPipe) radius: number = 10,
  ) {
    return this.locationsService.findNearby(latitude, longitude, radius);
  }

  @Get('distance')
  @ApiOperation({ summary: 'Calculate distance between two points' })
  @ApiQuery({ name: 'lat1', type: Number, example: 6.4281 })
  @ApiQuery({ name: 'lon1', type: Number, example: 3.4219 })
  @ApiQuery({ name: 'lat2', type: Number, example: 6.4474 })
  @ApiQuery({ name: 'lon2', type: Number, example: 3.4203 })
  @ApiResponse({ status: 200, description: 'Distance calculated' })
  calculateDistance(
    @Query('lat1', ParseFloatPipe) lat1: number,
    @Query('lon1', ParseFloatPipe) lon1: number,
    @Query('lat2', ParseFloatPipe) lat2: number,
    @Query('lon2', ParseFloatPipe) lon2: number,
  ) {
    return this.locationsService.calculateDistance(lat1, lon1, lat2, lon2);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiParam({ name: 'id', description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location found' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update location (partial)' })
  @ApiParam({ name: 'id', description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiBody({ type: UpdateLocationDto })
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Patch(':id/set-primary')
  @ApiOperation({ summary: 'Set location as primary' })
  @ApiParam({ name: 'id', description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location set as primary' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  setPrimary(@Param('id') id: string) {
    return this.locationsService.setPrimary(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle location active status' })
  @ApiParam({ name: 'id', description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location active status toggled' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  toggleActive(@Param('id') id: string) {
    return this.locationsService.toggleActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete location' })
  @ApiParam({ name: 'id', description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }

  // Google Maps Integration Endpoints

  @Get('google/live-location')
  @ApiOperation({ summary: 'Get live location from GPS coordinates' })
  @ApiQuery({ name: 'latitude', type: Number, example: 6.4281 })
  @ApiQuery({ name: 'longitude', type: Number, example: 3.4219 })
  @ApiResponse({ status: 200, description: 'Location data retrieved' })
  getLiveLocationFromCoordinates(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    return this.locationIQService.getLiveLocationFromCoordinates(
      latitude,
      longitude,
    );
  }

  @Get('google/coordinates')
  @ApiOperation({ summary: 'Get coordinates from address' })
  @ApiQuery({ name: 'address', type: String, example: 'Victoria Island Lagos Nigeria' })
  @ApiResponse({ status: 200, description: 'Coordinates retrieved' })
  getCoordinatesFromAddress(@Query('address') address: string) {
    return this.locationIQService.getCoordinatesFromAddress(address);
  }

  @Get('google/places/search')
  @ApiOperation({ summary: 'Search places' })
  @ApiQuery({ name: 'query', type: String, example: 'restaurants' })
  @ApiQuery({ name: 'latitude', type: Number, required: false, example: 6.4281 })
  @ApiQuery({ name: 'longitude', type: Number, required: false, example: 3.4219 })
  @ApiQuery({ name: 'radius', type: Number, required: false, example: 5000 })
  @ApiResponse({ status: 200, description: 'Places found' })
  searchPlaces(
    @Query('query') query: string,
    @Query('latitude', ParseFloatPipe) latitude?: number,
    @Query('longitude', ParseFloatPipe) longitude?: number,
    @Query('radius', ParseIntPipe) radius?: number,
  ) {
    const location =
      latitude && longitude ? { lat: latitude, lng: longitude } : undefined;
    return this.locationIQService.searchPlaces(query);
  }

  @Get('google/distance')
  @ApiOperation({ summary: 'Calculate distance and duration between two points' })
  @ApiQuery({ name: 'originLat', type: Number, example: 6.4281 })
  @ApiQuery({ name: 'originLng', type: Number, example: 3.4219 })
  @ApiQuery({ name: 'destLat', type: Number, example: 6.4474 })
  @ApiQuery({ name: 'destLng', type: Number, example: 3.4203 })
  @ApiResponse({ status: 200, description: 'Distance and duration calculated' })
  calculateDistanceAndDuration(
    @Query('originLat', ParseFloatPipe) originLat: number,
    @Query('originLng', ParseFloatPipe) originLng: number,
    @Query('destLat', ParseFloatPipe) destLat: number,
    @Query('destLng', ParseFloatPipe) destLng: number,
  ) {
    return this.locationIQService.calculateDistanceAndDuration(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng },
    );
  }

  @Post('google/create-from-coordinates')
  @ApiOperation({ summary: 'Create location from GPS coordinates (auto-fill address)' })
  @ApiResponse({ status: 201, description: 'Location created from coordinates' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', example: 6.4281 },
        longitude: { type: 'number', example: 3.4219 },
        user_id: { type: 'string', example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c' },
        location_type: { type: 'string', enum: ['HOME', 'OFFICE', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER'], example: 'HOME' },
      },
      required: ['latitude', 'longitude', 'user_id'],
    },
  })
  createFromCoordinates(
    @Body()
    body: {
      latitude: number;
      longitude: number;
      user_id: string;
      location_type?: string;
    },
  ) {
    return this.locationIQService
      .getLiveLocationFromCoordinates(body.latitude, body.longitude)
      .then((locationData) => {
        const createLocationDto: CreateLocationDto = {
          address: locationData.formatted_address,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          postal_code: locationData.postal_code,
          latitude: locationData.lat,
          longitude: locationData.lng,
          location_type: isValidLocationType(body.location_type)
            ? body.location_type
            : 'OTHER',
          user_id: body.user_id,
        };
        return this.locationsService.create(createLocationDto);
      });
  }

  @Post('google/create-from-address')
  @ApiOperation({ summary: 'Create location from address (auto-fill coordinates)' })
  @ApiResponse({ status: 201, description: 'Location created from address' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', example: 'kutus, kirinyaga, kenya' },
        user_id: { type: 'string', example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c' },
        location_type: { type: 'string', enum: ['HOME', 'OFFICE', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER'], example: 'OFFICE' },
      },
      required: ['address', 'user_id'],
    },
  })
  createFromAddress(
    @Body() body: { address: string; user_id: string; location_type?: string },
  ) {
    return this.locationIQService
      .getCoordinatesFromAddress(body.address)
      .then((locationData) => {
        const createLocationDto: CreateLocationDto = {
          address: locationData.formatted_address,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
          postal_code: locationData.postal_code,
          latitude: locationData.lat,
          longitude: locationData.lng,
          location_type: isValidLocationType(body.location_type)
            ? body.location_type
            : 'OTHER',
          user_id: body.user_id,
        };
        return this.locationsService.create(createLocationDto);
      });
  }
}
