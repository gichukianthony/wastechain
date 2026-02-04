import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationDigestCronService {
  private readonly logger = new Logger(NotificationDigestCronService.name);
  private readonly brevoApiKey?: string;
  private readonly brevoSenderEmail?: string;
  private readonly brevoSenderName?: string;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {
    this.brevoApiKey = process.env.BREVO_API_KEY;
    this.brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
    this.brevoSenderName = process.env.BREVO_SENDER_NAME || 'WasteChain';
  }

  /**
   * Daily notification digest email (unread notifications in the last 24 hours).
   *
   * Env:
   * - NOTIFICATION_DIGEST_ENABLED=true|false (default false)
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyNotificationDigest() {
    const enabled = String(process.env.NOTIFICATION_DIGEST_ENABLED || 'false') === 'true';
    if (!enabled) return;

    if (!this.brevoApiKey || !this.brevoSenderEmail) {
      this.logger.warn('Brevo not configured; skipping notification digest emails.');
      return;
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const notifications = await this.notificationRepository.find({
      where: {
        is_read: false,
      },
      relations: ['user'],
      order: { date_sent: 'DESC' },
    });

    // Group by user, filter by time window
    const perUser = new Map<string, Notification[]>();
    for (const n of notifications) {
      if (!n.user?.email) continue;
      if (n.date_sent && n.date_sent < since) continue;
      const key = n.user.email;
      const arr = perUser.get(key) || [];
      arr.push(n);
      perUser.set(key, arr);
    }

    let sent = 0;
    for (const [email, list] of perUser.entries()) {
      const items = list.slice(0, 20); // cap
      const htmlItems = items
        .map(
          (n) =>
            `<li><b>${n.notification_type}</b> - ${escapeHtml(n.message)}</li>`,
        )
        .join('');

      const html = `<p>Hello,</p><p>Here is your WasteChain notification digest (last 24 hours):</p><ul>${htmlItems}</ul><p>You have ${list.length} unread notifications in the last 24 hours.</p>`;

      try {
        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: {
              email: this.brevoSenderEmail,
              name: this.brevoSenderName,
            },
            to: [{ email }],
            subject: 'WasteChain - Daily Notifications Digest',
            htmlContent: html,
          },
          {
            headers: {
              'api-key': this.brevoApiKey,
              'Content-Type': 'application/json',
            },
          },
        );
        sent++;
      } catch (err) {
        this.logger.error(`Failed to send digest to ${email}`, err as any);
      }
    }

    if (sent > 0) {
      this.logger.log(`Sent ${sent} notification digest emails.`);
    }
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

