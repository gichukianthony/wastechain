import { IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAnalyticsDto {
  @IsOptional()
  @IsUUID()
  analytics_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsString()
  metric: string;

  @IsNumber()
  value: number;

  @IsOptional()
  date_recorded?: Date;
}
