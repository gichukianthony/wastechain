import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Phone number in international format',
    example: '+254799163101',
  })
  @IsPhoneNumber()
  phone: string;
}


