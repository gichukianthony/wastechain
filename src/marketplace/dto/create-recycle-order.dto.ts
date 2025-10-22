import {
  IsUUID,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateRecycleOrderDto {
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @IsOptional()
  @IsString()
  recycler?: string;

  @IsString()
  material_type: string;

  @IsNumber()
  required_quantity_kg: number;

  @IsEnum(['OPEN', 'IN_PROGRESS', 'FULFILLED'])
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';

  @IsOptional()
  collections?: string[];
}
