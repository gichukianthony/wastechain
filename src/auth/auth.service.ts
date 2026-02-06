import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import * as speakeasy from 'speakeasy';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Injectable()
export class AuthService {
  private readonly otpStore = new Map<
    string,
    { code: string; expiresAt: number }
  >();
  private readonly whatsappAccessToken?: string;
  private readonly whatsappPhoneNumberId?: string;
  private readonly brevoApiKey?: string;
  private readonly brevoSenderEmail?: string;
  private readonly brevoSenderName?: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {
    this.whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.brevoApiKey = process.env.BREVO_API_KEY;
    this.brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
    this.brevoSenderName = process.env.BREVO_SENDER_NAME || 'WasteChain';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async issueToken(
    user: User,
    provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'WHATSAPP' | 'AUTHENTICATOR',
  ) {
    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // Persist auth metadata
    const authRecord = this.authRepository.create({
      user,
      provider,
      last_login: new Date(),
    });
    await this.authRepository.save(authRecord);

    return {
      access_token: accessToken,
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.issueToken(user, 'LOCAL');
  }

  async loginWithGoogle(idToken: string) {
    // Verify token with Google
    const res = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
      params: { id_token: idToken },
    });
    const data = res.data as {
      email?: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      aud?: string;
    };

    if (!data.email) {
      throw new UnauthorizedException('Google token missing email');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && data.aud !== clientId) {
      throw new UnauthorizedException('Invalid Google token audience');
    }

    let user = await this.usersService.findByEmail(data.email);
    if (!user) {
      const fullName = data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim();
      user = await this.usersService.createUserForGoogle(data.email, fullName);
    }

    return this.issueToken(user, 'GOOGLE');
  }

  async requestOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const ttlMs = 5 * 60 * 1000; // 5 minutes
    this.otpStore.set(phone, {
      code,
      expiresAt: Date.now() + ttlMs,
    });

    const baseResponse = {
      phone,
      expiresInSeconds: ttlMs / 1000,
    };

    if (this.whatsappAccessToken && this.whatsappPhoneNumberId) {
      try {
        await axios.post(
          `https://graph.facebook.com/v19.0/${this.whatsappPhoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: {
              preview_url: false,
              body: `Your WasteChain verification code is ${code}`,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.whatsappAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        return {
          ...baseResponse,
          message: 'OTP sent via WhatsApp',
        };
      } catch (error) {
        console.error('WhatsApp message failed', error);
        // fall through to fallback
      }
    }

    return {
      ...baseResponse,
      code,
      message: 'WhatsApp not configured; returning OTP for testing',
    };
  }

  async verifyOtp(phone: string, code: string) {
    const entry = this.otpStore.get(phone);
    if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // OTP is one-time use
    this.otpStore.delete(phone);

    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.createUserForPhone(phone);
    }

    return this.issueToken(user, 'WHATSAPP');
  }

  async setupAuthenticator(userId: string) {
    const user = await this.usersService.findOne(userId);
    const secret = speakeasy.generateSecret({
      name: `WasteChain (${user.email || user.full_name})`,
      length: 20,
    });
    await this.usersService.setAuthenticatorSecret(userId, secret.base32);
    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    };
  }

  async verifyAuthenticator(userId: string, token: string) {
    const user = await this.usersService.findOne(userId);
    if (!user.authenticator_secret) {
      throw new BadRequestException('Authenticator not set up');
    }
    const verified = speakeasy.totp.verify({
      secret: user.authenticator_secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!verified) {
      throw new UnauthorizedException('Invalid authenticator token');
    }
    return { verified: true };
  }

  async loginWithAuthenticator(email: string, token: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.authenticator_secret) {
      throw new UnauthorizedException('Authenticator not set up for user');
    }
    const valid = speakeasy.totp.verify({
      secret: user.authenticator_secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!valid) {
      throw new UnauthorizedException('Invalid authenticator token');
    }
    return this.issueToken(user, 'AUTHENTICATOR');
  }

  // Basic CRUD methods for the auth table if needed elsewhere
  async create(createAuthDto: CreateAuthDto) {
    const user = createAuthDto.user
      ? await this.usersService.findOne(createAuthDto.user)
      : undefined;
    const auth = this.authRepository.create({
      user,
      provider: createAuthDto.provider,
      hashed_refresh_token: createAuthDto.hashed_refresh_token,
      last_login: createAuthDto.last_login,
    });
    return this.authRepository.save(auth);
  }

  async findAll() {
    return this.authRepository.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const auth = await this.authRepository.findOne({
      where: { auth_id: id },
      relations: ['user'],
    });
    if (!auth) {
      throw new NotFoundException('Auth record not found');
    }
    return auth;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const auth = await this.findOne(id);
    Object.assign(auth, updateAuthDto);
    return this.authRepository.save(auth);
  }

  async remove(id: string) {
    const auth = await this.findOne(id);
    await this.authRepository.remove(auth);
    return { deleted: true };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return {
        message:
          'If an account with that email exists, a password reset link has been sent.',
        email,
      };
    }

    // Invalidate previous tokens for this user
    await this.passwordResetTokenRepository.delete({
      user: { user_id: user.user_id } as any,
    });

    // Generate secure reset token
    const resetToken = this.generateResetToken();
    const ttlMs = 15 * 60 * 1000; // 15 minutes
    const expiresAt = new Date(Date.now() + ttlMs);

    // Persist reset token
    const resetEntity = this.passwordResetTokenRepository.create({
      user,
      token: resetToken,
      expires_at: expiresAt,
      used: false,
    });
    await this.passwordResetTokenRepository.save(resetEntity);

    const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email,
    )}`;

    // Send email via Brevo if configured
    if (this.brevoApiKey && this.brevoSenderEmail) {
      try {
        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: {
              email: this.brevoSenderEmail,
              name: this.brevoSenderName,
            },
            to: [{ email }],
            subject: 'WasteChain - Password Reset Request',
            htmlContent: `<p>Hello ${
              user.full_name || 'WasteChain user'
            },</p><p>You requested to reset your password. Click the link below to reset it:</p><p><a href="${resetLink}">Reset your password</a></p><p>This link will expire in 15 minutes. If you did not request this, you can safely ignore this email.</p>`,
          },
          {
            headers: {
              'api-key': this.brevoApiKey,
              'Content-Type': 'application/json',
            },
          },
        );
      } catch (error) {
        console.error('Failed to send password reset email via Brevo', error);
      }
    }

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
      email,
      ...(process.env.NODE_ENV !== 'production' && {
        resetToken,
        resetLink,
      }),
    };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const resetEntity = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (
      !resetEntity ||
      resetEntity.used ||
      resetEntity.user.email !== email ||
      resetEntity.expires_at.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedPassword);

    resetEntity.used = true;
    await this.passwordResetTokenRepository.save(resetEntity);

    return {
      message: 'Password reset successfully',
      email,
    };
  }

  private generateResetToken(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 48; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}
