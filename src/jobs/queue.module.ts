import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Location } from '../locations/entities/location.entity';
import { WastePickupProcessor } from './waste-pickup.processor';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import { CronMaintenanceService } from './cron-maintenance.service';
import { Notification } from 'src/notifications/entities/notification.entity';

const wastePickupQueueProvider = {
  provide: 'WASTE_PICKUP_QUEUE',
  useFactory: () => {
    const { Queue } = require('bullmq');
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
    };
    return new Queue('waste-pickup', { connection });
  },
};

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Location, PasswordResetToken, Notification])],
  providers: [wastePickupQueueProvider, WastePickupProcessor, CronMaintenanceService],
  exports: [wastePickupQueueProvider],
})
export class QueueModule {}
