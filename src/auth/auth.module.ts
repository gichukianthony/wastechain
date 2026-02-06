import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DidAuthController } from './did-auth.controller';
import { DidAuthService } from './did-auth.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { UserCredential } from '../users/entities/user-credential.entity';
import { Auth } from './entities/auth.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, UserCredential, Auth, PasswordResetToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, DidAuthController],
  providers: [AuthService, DidAuthService],
})
export class AuthModule {}
