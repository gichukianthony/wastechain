import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './entities/reward.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const user = await this.userRepository.findOne({
      where: { user_id: createRewardDto.user },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reward = this.rewardRepository.create({
      user: user,
      points_earned: createRewardDto.points_earned,
      description: createRewardDto.description,
    });

    return await this.rewardRepository.save(reward);
  }

  async findAll(): Promise<Reward[]> {
    return await this.rewardRepository.find({
      relations: ['user'],
      order: { date_awarded: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({
      where: { reward_id: id },
      relations: ['user'],
    });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const reward = await this.findOne(id);

    if (updateRewardDto.user) {
      const user = await this.userRepository.findOne({
        where: { user_id: updateRewardDto.user },
      });
      if (!user) throw new NotFoundException('User not found');
      reward.user = user;
    }

    Object.assign(reward, updateRewardDto);
    return await this.rewardRepository.save(reward);
  }

  async remove(id: string): Promise<void> {
    const reward = await this.findOne(id);
    await this.rewardRepository.remove(reward);
  }
}
