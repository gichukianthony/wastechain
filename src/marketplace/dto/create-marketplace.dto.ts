import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarketplaceDto {
  @ApiProperty({ required: false, description: 'Marketplace item UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  marketplace_id?: string;

  @ApiProperty({ example: 'Recycled Plastic Bottles', description: 'Item name' })
  @IsString()
  item_name: string;

  @ApiProperty({ example: 25.50, description: 'Item price' })
  @IsNumber()
  price: number;

  @ApiProperty({ required: false, example: 'Clean plastic bottles ready for recycling', description: 'Item description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'Seller user UUID' })
  @IsOptional()
  @IsString()
  seller?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'Buyer user UUID' })
  @IsOptional()
  @IsString()
  buyer?: string;

  @ApiProperty({ enum: ['LISTED', 'SOLD', 'CANCELLED'], example: 'LISTED', description: 'Item status' })
  @IsEnum(['LISTED', 'SOLD', 'CANCELLED'])
  status: 'LISTED' | 'SOLD' | 'CANCELLED';

  @ApiProperty({ required: false, description: 'Date listed (auto-generated if not provided)' })
  @IsOptional()
  date_listed?: Date;
}
