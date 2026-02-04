import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Marketplace } from './entities/marketplace.entity';

@Injectable()
export class MarketplaceCronService {
  private readonly logger = new Logger(MarketplaceCronService.name);

  constructor(
    @InjectRepository(Marketplace)
    private readonly marketplaceRepository: Repository<Marketplace>,
  ) {}

  /**
   * Auto-cancel stale marketplace listings daily at 2AM.
   *
   * Controlled by env:
   * - MARKETPLACE_STALE_DAYS (default: 30)
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async autoCancelStaleListings() {
    const staleDays = Number(process.env.MARKETPLACE_STALE_DAYS || 30);
    const cutoff = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000);

    const result = await this.marketplaceRepository.update(
      { status: 'LISTED', date_listed: LessThan(cutoff) as any },
      { status: 'CANCELLED' },
    );

    if (result.affected && result.affected > 0) {
      this.logger.log(
        `Auto-cancelled ${result.affected} stale marketplace listings older than ${staleDays} days.`,
      );
    }
  }
}

