import { IsUUID, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ required: false, description: 'Auth record UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  auth_id?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'User UUID' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({ required: false, description: 'Hashed refresh token' })
  @IsOptional()
  @IsString()
  hashed_refresh_token?: string;

  @ApiProperty({ enum: ['LOCAL', 'GOOGLE', 'FACEBOOK', 'WHATSAPP', 'AUTHENTICATOR'], example: 'LOCAL', description: 'Authentication provider' })
  @IsEnum(['LOCAL', 'GOOGLE', 'FACEBOOK', 'WHATSAPP', 'AUTHENTICATOR'])
  provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'WHATSAPP' | 'AUTHENTICATOR';

  @ApiProperty({ required: false, description: 'Last login timestamp' })
  @IsOptional()
  last_login?: Date;
}
