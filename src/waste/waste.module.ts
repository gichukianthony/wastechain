import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { Waste } from './entities/waste.entity';
import { WasteRequest } from './entities/waste-request.entity';
import { User } from 'src/users/entities/user.entity';
import { BullModule } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueModule } from '../jobs/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Waste, WasteRequest, User]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'waste-pickup',
    }),
    QueueModule,
  ],
  controllers: [WasteController],
  providers: [WasteService],
  exports: [WasteService],
})
export class WasteModule {}
