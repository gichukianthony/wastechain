import { IsUUID, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateRewardDto {
  @IsOptional()
  @IsUUID()
  reward_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsInt()
  points_earned: number;

  @IsString()
  description: string;

  @IsOptional()
  date_awarded?: Date;
}
