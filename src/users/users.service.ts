import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      full_name: createUserDto.full_name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
      phone_number: createUserDto.phone_number,
      location: createUserDto.location,
      green_points: createUserDto.green_points ?? 0,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['waste_requests'],
      order: { full_name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['waste_requests'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async findByCredential(type: string, identifier: string): Promise<User | null> {
    // This assumes there is a relation or we query credentials repo directly.
    // Since UsersService doesn't inject CredentialsRepository, we might need to join.
    // Or better, inject CredentialsRepository here or use a query builder.
    // Given the current structure, let's assume we can query via user relations if we had bidirectional,
    // but UserCredential has 'user'. User has 'credentials'? No, it's not in the entity definition I saw.
    // I should probably inject UserCredential repository here or add the relation to User.
    // For now, let's try to find via query builder on User if possible, or inject the repo.
    // Wait, did-auth.service.ts injects UserCredential repository.
    // Maybe I should move this logic to DidAuthService?
    // But DidAuthService calls this.usersService.findByCredential.
    // So UsersService is expected to handle it.
    // I will inject UserCredential repository into UsersService.
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.credentials', 'c')
      .where('c.type = :type', { type })
      .andWhere('c.identifier = :identifier', { identifier })
      .getOne();
  }

  async createUserForDid(did: string): Promise<User> {
    const user = this.usersRepository.create({
      full_name: `DID User ${did.slice(-6)}`,
      email: `${did}@wastechain.app`, // Dummy email
      password: '',
      role: 'HOUSEHOLD',
      green_points: 0,
    });
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUserForGoogle(email: string, fullName?: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) return existing;

    const user = this.usersRepository.create({
      full_name: fullName || email,
      email,
      password: '',
      role: 'HOUSEHOLD',
      green_points: 0,
    });
    return this.usersRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone_number: phone } });
  }

  async createUserForPhone(phone: string): Promise<User> {
    const existing = await this.findByPhone(phone);
    if (existing) {
      return existing;
    }

    const user = this.usersRepository.create({
      full_name: `OTP User ${phone.slice(-4)}`,
      email: `${phone}@wastechain.app`,
      password: '',
      role: 'HOUSEHOLD',
      phone_number: phone,
      green_points: 0,
    });
    return this.usersRepository.save(user);
  }

  async setAuthenticatorSecret(userId: string, secret: string) {
    const user = await this.findOne(userId);
    user.authenticator_secret = secret;
    return this.usersRepository.save(user);
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }
}
