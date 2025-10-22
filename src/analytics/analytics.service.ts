import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { Analytics } from './entities/analytics.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAnalyticsDto: CreateAnalyticsDto): Promise<Analytics> {
    let user: User | null = null;
    if (createAnalyticsDto.user) {
      user = await this.userRepository.findOne({
        where: { user_id: createAnalyticsDto.user },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const analytics = this.analyticsRepository.create({
      user: user || undefined,
      metric: createAnalyticsDto.metric,
      value: createAnalyticsDto.value,
    });

    return await this.analyticsRepository.save(analytics);
  }

  async findAll(): Promise<Analytics[]> {
    return await this.analyticsRepository.find({
      relations: ['user'],
      order: { date_recorded: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Analytics> {
    const analytics = await this.analyticsRepository.findOne({
      where: { analytics_id: id },
      relations: ['user'],
    });
    if (!analytics) throw new NotFoundException('Analytics record not found');
    return analytics;
  }

  async update(
    id: string,
    updateAnalyticsDto: UpdateAnalyticsDto,
  ): Promise<Analytics> {
    const analytics = await this.findOne(id);

    if (updateAnalyticsDto.user) {
      const user = await this.userRepository.findOne({
        where: { user_id: updateAnalyticsDto.user },
      });
      if (!user) throw new NotFoundException('User not found');
      analytics.user = user;
    }

    Object.assign(analytics, updateAnalyticsDto);
    return await this.analyticsRepository.save(analytics);
  }

  async remove(id: string): Promise<void> {
    const analytics = await this.findOne(id);
    await this.analyticsRepository.remove(analytics);
  }

  // Additional analytics methods
  async findByUser(userId: string): Promise<Analytics[]> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.analyticsRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user'],
      order: { date_recorded: 'DESC' },
    });
  }

  async findByMetric(metric: string): Promise<Analytics[]> {
    return await this.analyticsRepository.find({
      where: { metric },
      relations: ['user'],
      order: { date_recorded: 'DESC' },
    });
  }

  async getAggregatedMetrics(): Promise<any[]> {
    return await this.analyticsRepository
      .createQueryBuilder('analytics')
      .select('analytics.metric', 'metric')
      .addSelect('AVG(analytics.value)', 'avgValue')
      .addSelect('SUM(analytics.value)', 'totalValue')
      .addSelect('COUNT(analytics.value)', 'count')
      .groupBy('analytics.metric')
      .getRawMany();
  }
}
