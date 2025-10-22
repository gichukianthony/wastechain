import {
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsUUID()
  notification_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @IsEnum(['REWARD', 'MARKETPLACE', 'WASTE', 'GENERAL'])
  notification_type: 'REWARD' | 'MARKETPLACE' | 'WASTE' | 'GENERAL';

  @IsOptional()
  date_sent?: Date;
}
