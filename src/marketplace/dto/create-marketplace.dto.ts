import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateMarketplaceDto {
  @IsOptional()
  @IsUUID()
  marketplace_id?: string;

  @IsString()
  item_name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  seller?: string;

  @IsOptional()
  @IsString()
  buyer?: string;

  @IsEnum(['LISTED', 'SOLD', 'CANCELLED'])
  status: 'LISTED' | 'SOLD' | 'CANCELLED';

  @IsOptional()
  date_listed?: Date;
}
