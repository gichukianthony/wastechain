import { IsUUID, IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ required: false, description: 'Reward UUID (auto-generated if not provided)' })
  @IsOptional()
  @IsUUID()
  reward_id?: string;

  @ApiProperty({ required: false, example: 'be711bcf-7a0a-4033-ab7b-23a895bf6e7c', description: 'User UUID' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({ example: 50, description: 'Points earned' })
  @IsInt()
  points_earned: number;

  @ApiProperty({ example: 'Eco-friendly waste disposal reward', description: 'Reward description' })
  @IsString()
  description: string;

  @ApiProperty({ required: false, description: 'Date awarded (auto-generated if not provided)' })
  @IsOptional()
  date_awarded?: Date;
}
