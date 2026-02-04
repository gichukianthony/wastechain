import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { AnalyticsService } from './analytics.service';

function isoDateOnly(d: Date) {
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class AnalyticsCronService {
  private readonly logger = new Logger(AnalyticsCronService.name);

  constructor(
    private readonly analyticsService: AnalyticsService,
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  /**
   * Daily snapshot of aggregated metrics.
   * Stores per-metric rows in the existing `analytics` table (user = null).
   *
   * Metrics stored:
   * - agg_daily_avg:<metric>:<YYYY-MM-DD>
   * - agg_daily_sum:<metric>:<YYYY-MM-DD>
   * - agg_daily_count:<metric>:<YYYY-MM-DD>
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async snapshotAggregatedMetricsDaily() {
    const today = new Date();
    const day = isoDateOnly(today);

    const rows = await this.analyticsService.getAggregatedMetrics();

    let inserted = 0;
    for (const row of rows) {
      const metric = String(row.metric);
      const avg = Number(row.avgValue);
      const total = Number(row.totalValue);
      const count = Number(row.count);

      // Create 3 snapshot records per metric (avg/sum/count)
      const snapshots: Array<{ metric: string; value: number }> = [
        { metric: `agg_daily_avg:${metric}:${day}`, value: avg },
        { metric: `agg_daily_sum:${metric}:${day}`, value: total },
        { metric: `agg_daily_count:${metric}:${day}`, value: count },
      ];

      for (const s of snapshots) {
        const exists = await this.analyticsRepository.findOne({
          where: { metric: s.metric },
        });
        if (exists) continue;

        await this.analyticsRepository.save(
          this.analyticsRepository.create({
            metric: s.metric,
            value: s.value,
            user: null as any, // column is nullable in DB; entity type is non-nullable
          }),
        );
        inserted++;
      }
    }

    if (inserted > 0) {
      this.logger.log(`Inserted ${inserted} daily aggregated metric snapshots.`);
    }
  }
}

