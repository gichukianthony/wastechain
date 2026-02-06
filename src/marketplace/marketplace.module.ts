import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { Marketplace } from './entities/marketplace.entity';
import { RecyclerOrder } from './entities/recycle-order.entity';
import { User } from 'src/users/entities/user.entity';
import { MarketplaceCronService } from './marketplace.cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([Marketplace, RecyclerOrder, User])],
  controllers: [MarketplaceController],
  providers: [MarketplaceService, MarketplaceCronService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
