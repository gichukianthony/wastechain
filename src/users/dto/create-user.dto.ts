import {
  IsUUID,
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['HOUSEHOLD', 'COLLECTOR', 'RECYCLER', 'ADMIN'])
  role: 'HOUSEHOLD' | 'COLLECTOR' | 'RECYCLER' | 'ADMIN';

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  green_points?: number;
}
