import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsLatitude,
  IsLongitude,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: '123 Main Street, Victoria Island', description: 'Street address', minLength: 5, maxLength: 200 })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @ApiProperty({ required: false, example: 'Lagos', description: 'City name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ required: false, example: 'Lagos State', description: 'State/Province', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ required: false, example: 'Nigeria', description: 'Country name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ required: false, example: '101241', description: 'Postal/ZIP code', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postal_code?: string;

  @ApiProperty({ required: false, example: 6.4281, description: 'Latitude coordinate' })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ required: false, example: 3.4219, description: 'Longitude coordinate' })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ required: false, example: 'Near Shoprite Mall', description: 'Nearby landmark', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  landmark?: string;

  @ApiProperty({ required: false, example: 'Ring the doorbell twice', description: 'Delivery instructions', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  instructions?: string;

  @ApiProperty({ required: false, enum: ['HOME', 'OFFICE', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER'], example: 'HOME', description: 'Location type' })
  @IsOptional()
  @IsEnum(['HOME', 'OFFICE', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER'])
  location_type?: 'HOME' | 'OFFICE' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER';

  @ApiProperty({ required: false, example: true, description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false, example: true, description: 'Primary location flag', default: false })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @ApiProperty({ example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'User UUID' })
  @IsUUID()
  user_id: string;
}
