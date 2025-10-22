import { IsUUID, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateAuthDto {
  @IsOptional()
  @IsUUID()
  auth_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  hashed_refresh_token?: string;

  @IsEnum(['LOCAL', 'GOOGLE', 'FACEBOOK'])
  provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';

  @IsOptional()
  last_login?: Date;
}
