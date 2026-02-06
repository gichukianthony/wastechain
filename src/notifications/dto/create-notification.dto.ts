import {
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ required: false, description: 'Notification UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  notification_id?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'User UUID' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({ example: 'Your waste collection request has been approved', description: 'Notification message' })
  @IsString()
  message: string;

  @ApiProperty({ required: false, example: false, description: 'Read status', default: false })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @ApiProperty({ enum: ['REWARD', 'MARKETPLACE', 'WASTE', 'GENERAL'], example: 'WASTE', description: 'Notification type' })
  @IsEnum(['REWARD', 'MARKETPLACE', 'WASTE', 'GENERAL'])
  notification_type: 'REWARD' | 'MARKETPLACE' | 'WASTE' | 'GENERAL';

  @ApiProperty({ required: false, description: 'Date sent (auto-generated if not provided)' })
  @IsOptional()
  date_sent?: Date;
}
