import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Injectable()
export class CronMaintenanceService {
  private readonly logger = new Logger(CronMaintenanceService.name);

  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Clean up expired password reset tokens every hour.
   * - Deletes tokens whose expiry is in the past
   * - Optionally, could also delete very old used tokens
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredPasswordResetTokens() {
    const now = new Date();

    const result = await this.passwordResetTokenRepository.delete({
      expires_at: LessThan(now),
    });

    if (result.affected && result.affected > 0) {
      this.logger.log(
        `Cleaned up ${result.affected} expired password reset tokens.`,
      );
    }
  }

  /**
   * Clean up old notifications daily at 3AM.
   *
   * Env:
   * - NOTIFICATION_RETENTION_DAYS (default: 90)
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldNotifications() {
    const retentionDays = Number(process.env.NOTIFICATION_RETENTION_DAYS || 90);
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const result = await this.notificationRepository.delete({
      date_sent: LessThan(cutoff),
    });

    if (result.affected && result.affected > 0) {
      this.logger.log(
        `Deleted ${result.affected} notifications older than ${retentionDays} days.`,
      );
    }
  }
}

