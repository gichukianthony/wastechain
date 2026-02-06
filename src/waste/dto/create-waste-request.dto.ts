import {
  IsUUID,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWasteRequestDto {
  @ApiProperty({ required: false, description: 'Request UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  request_id?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'User UUID' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({ enum: ['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'], example: 'PLASTIC', description: 'Type of waste' })
  @IsEnum(['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'])
  waste_type: string;

  @ApiProperty({ enum: ['PENDING', 'ASSIGNED', 'COLLECTED', 'COMPLETED'], example: 'PENDING', description: 'Request status' })
  @IsEnum(['PENDING', 'ASSIGNED', 'COLLECTED', 'COMPLETED'])
  status: 'PENDING' | 'ASSIGNED' | 'COLLECTED' | 'COMPLETED';

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'Collector user UUID' })
  @IsOptional()
  @IsString()
  collector?: string;

  @ApiProperty({ required: false, example: 1.5, description: 'Weight in kilograms' })
  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @ApiProperty({ required: false, description: 'Request date (auto-generated if not provided)' })
  @IsOptional()
  request_date?: Date;

  @ApiProperty({ required: false, example: '2024-01-15T10:00:00Z', description: 'Preferred pickup time' })
  @IsOptional()
  @IsString()
  pickup_time?: string;
}
