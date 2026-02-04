import { IsPhoneNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Phone number in international format',
    example: '+254799163101',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'OTP code received via WhatsApp',
    example: '123456',
    minLength: 4,
    maxLength: 6,
  })
  @IsString()
  @Length(4, 6)
  code: string;
}


