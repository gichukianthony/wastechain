import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationDigestCronService } from './notification-digest.cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationDigestCronService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
