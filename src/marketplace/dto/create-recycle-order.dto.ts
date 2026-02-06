import {
  IsUUID,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecycleOrderDto {
  @ApiProperty({ required: false, description: 'Order UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'Recycler user UUID' })
  @IsOptional()
  @IsString()
  recycler?: string;

  @ApiProperty({ example: 'Plastic bottles', description: 'Material type required' })
  @IsString()
  material_type: string;

  @ApiProperty({ example: 100.0, description: 'Required quantity in kilograms' })
  @IsNumber()
  required_quantity_kg: number;

  @ApiProperty({ enum: ['OPEN', 'IN_PROGRESS', 'FULFILLED'], example: 'OPEN', description: 'Order status' })
  @IsEnum(['OPEN', 'IN_PROGRESS', 'FULFILLED'])
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';

  @ApiProperty({ required: false, type: [String], description: 'Collection IDs' })
  @IsOptional()
  collections?: string[];
}
