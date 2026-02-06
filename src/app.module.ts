import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { LogsModule } from './logs/logs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { LoggerMiddleware } from './logs/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { RewardsModule } from './rewards/rewards.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WasteModule } from './waste/waste.module';
import { LocationsModule } from './locations/locations.module';
import { QueueModule } from './jobs/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          // Reuse existing Redis config if set, fallback to localhost
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: configService.get<number>('REDIS_CACHE_DB', 0),
        }),
        ttl: configService.get<number>('CACHE_TTL_SECONDS', 60), // default: 60 seconds
        max: configService.get<number>('CACHE_MAX_ITEMS', 1000),
      }),
    }),
    ScheduleModule.forRoot(),
    // Rate Limiting Configuration
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60000), // 1 minute
          limit: configService.get<number>('THROTTLE_LIMIT', 100), // 100 requests per minute
        },
      ],
    }),
    DatabaseModule,
    LogsModule,
    UsersModule,
    AuthModule,
    MarketplaceModule,
    RewardsModule,
    NotificationsModule,
    AnalyticsModule,
    WasteModule,
    LocationsModule,
    QueueModule,
  ],
  controllers: [],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global cache interceptor for endpoints that opt-in via decorators
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
