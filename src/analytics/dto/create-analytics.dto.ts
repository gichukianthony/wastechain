import { IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalyticsDto {
  @ApiProperty({ required: false, description: 'Analytics record UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  analytics_id?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'User UUID' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({ example: 'waste_collected_kg', description: 'Metric name' })
  @IsString()
  metric: string;

  @ApiProperty({ example: 15.5, description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiProperty({ required: false, description: 'Date recorded (auto-generated if not provided)' })
  @IsOptional()
  date_recorded?: Date;
}
