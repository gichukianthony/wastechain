import {
  IsUUID,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateWasteRequestDto {
  @IsOptional()
  @IsUUID()
  request_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsEnum(['PLASTIC', 'GLASS', 'METAL', 'ORGANIC', 'E-WASTE'])
  waste_type: string;

  @IsEnum(['PENDING', 'ASSIGNED', 'COLLECTED', 'COMPLETED'])
  status: 'PENDING' | 'ASSIGNED' | 'COLLECTED' | 'COMPLETED';

  @IsOptional()
  @IsString()
  collector?: string;

  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @IsOptional()
  request_date?: Date;

  @IsOptional()
  @IsString()
  pickup_time?: string;
}
