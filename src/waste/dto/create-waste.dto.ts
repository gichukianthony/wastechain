import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWasteDto {
  @IsOptional()
  @IsUUID()
  waste_id?: string;

  @IsEnum(['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'])
  type: string;

  @IsNumber()
  weight_kg: number;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  date_created?: Date;
}
