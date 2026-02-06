import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWasteDto {
  @ApiProperty({ required: false, description: 'Waste UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  waste_id?: string;

  @ApiProperty({ enum: ['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'], example: 'PLASTIC', description: 'Type of waste' })
  @IsEnum(['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'])
  type: string;

  @ApiProperty({ example: 2.5, description: 'Weight in kilograms' })
  @IsNumber()
  weight_kg: number;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'Owner user UUID' })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiProperty({ required: false, example: 'Plastic bottles and containers', description: 'Waste description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Date created (auto-generated if not provided)' })
  @IsOptional()
  date_created?: Date;
}
