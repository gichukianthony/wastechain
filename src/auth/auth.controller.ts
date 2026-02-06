import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyAuthenticatorDto } from './dto/verify-authenticator.dto';
import { AuthenticatorLoginDto } from './dto/authenticator-login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { SkipThrottle } from '../common/decorators/throttle.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
 @Throttle({ default: { limit: 5, ttl: 60000 } })// 5 attempts per minute
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('google')
 @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @ApiOperation({ summary: 'Login with Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: GoogleLoginDto })
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.idToken);
  }

  @Post('otp/request')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 OTP requests per minute (prevent abuse)
  @ApiOperation({ summary: 'Request OTP via WhatsApp' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully via WhatsApp' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: RequestOtpDto })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.phone);
  }

  @Post('otp/verify')
 @Throttle({ default: { limit: 5, ttl: 60000 } })// 5 verification attempts per minute
  @ApiOperation({ summary: 'Verify OTP and get JWT token' })
  @ApiResponse({ status: 200, description: 'OTP verified, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: VerifyOtpDto })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('authenticator/setup')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Setup authenticator (TOTP) for user' })
  @ApiResponse({ status: 200, description: 'Returns QR code URL and secret for authenticator app' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setupAuthenticator(@Req() req: any) {
    return this.authService.setupAuthenticator(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('authenticator/verify')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify authenticator token to finalize setup' })
  @ApiResponse({ status: 200, description: 'Authenticator verified successfully' })
  @ApiResponse({ status: 400, description: 'Authenticator not set up' })
  @ApiResponse({ status: 401, description: 'Invalid token or unauthorized' })
  @ApiBody({ type: VerifyAuthenticatorDto })
  verifyAuthenticator(@Req() req: any, @Body() dto: VerifyAuthenticatorDto) {
    return this.authService.verifyAuthenticator(req.user.sub, dto.token);
  }

  @Post('authenticator/login')
@Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @ApiOperation({ summary: 'Login using authenticator (TOTP)' })
  @ApiResponse({ status: 200, description: 'Authenticator login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid authenticator token' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: AuthenticatorLoginDto })
  authenticatorLogin(@Body() dto: AuthenticatorLoginDto) {
    return this.authService.loginWithAuthenticator(dto.email, dto.token);
  }

  @Post('password/reset-request')
@Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute (prevent abuse)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset link sent to email (or token returned in dev mode)' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: RequestPasswordResetDto })
  requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('password/reset')
@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired reset token' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @SkipThrottle() // Skip rate limiting for authenticated profile endpoint
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
