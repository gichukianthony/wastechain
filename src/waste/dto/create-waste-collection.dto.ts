import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateWasteCollectionDto {
  @IsOptional()
  @IsUUID()
  collection_id?: string;

  @IsOptional()
  @IsString()
  request?: string;

  @IsOptional()
  @IsString()
  recycler_order?: string;

  @IsOptional()
  @IsString()
  collector?: string;

  @IsOptional()
  collected_at?: Date;

  @IsNumber()
  weight_kg: number;

  @IsEnum(['VERIFIED', 'REJECTED'])
  status: 'VERIFIED' | 'REJECTED';
}
