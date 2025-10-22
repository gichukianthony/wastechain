import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({
      where: { user_id: createNotificationDto.user },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      user: user,
      message: createNotificationDto.message,
      is_read: createNotificationDto.is_read ?? false,
      notification_type: createNotificationDto.notification_type,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      relations: ['user'],
      order: { date_sent: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: id },
      relations: ['user'],
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(id);

    if (updateNotificationDto.user) {
      const user = await this.userRepository.findOne({
        where: { user_id: updateNotificationDto.user },
      });
      if (!user) throw new NotFoundException('User not found');
      notification.user = user;
    }

    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  // Additional methods for notification management
  async findByUser(userId: string): Promise<Notification[]> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.notificationRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user'],
      order: { date_sent: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.is_read = true;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.notificationRepository.update(
      { user: { user_id: userId }, is_read: false },
      { is_read: true },
    );
  }
}
