import {
  IsUUID,
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: false, description: 'User UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ChangeMe123!', description: 'User password', minLength: 6 })
  @IsString()
  password: string;

  @ApiProperty({ enum: ['HOUSEHOLD', 'COLLECTOR', 'RECYCLER', 'ADMIN'], example: 'HOUSEHOLD', description: 'User role' })
  @IsEnum(['HOUSEHOLD', 'COLLECTOR', 'RECYCLER', 'ADMIN'])
  role: 'HOUSEHOLD' | 'COLLECTOR' | 'RECYCLER' | 'ADMIN';

  @ApiProperty({ required: false, example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ required: false, example: 'Lagos, NG', description: 'User location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, example: 0, description: 'Green points balance', default: 0 })
  @IsOptional()
  @IsNumber()
  green_points?: number;
}
