import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private static instance: UsersService;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    if (!UsersService.instance) {
      UsersService.instance = this;
    }
    return UsersService.instance;
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new ConflictException({ statusCode: 409, message: 'Email already in use', error: 'Conflict' });
    }

    const pepper = process.env.PEPPER ?? '';
    const password = await bcrypt.hash(createUserDto.password + pepper, 10);

    const user = this.userRepository.create({
      email: createUserDto.email,
      password,
      job_title: createUserDto.job_title,
      language: createUserDto.language,
      theme_mode: createUserDto.theme_mode,
    });

    await this.userRepository.save(user);
    return { message: 'User created', data: this.serialize(user) };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return { message: 'Users fetched', data: users.map((user) => this.serialize(user)) };
  }

  async findOne(user_id: number) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException({ statusCode: 404, message: 'User not found', error: 'Not Found' });
    }
    return { message: 'User fetched', data: this.serialize(user) };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException({ statusCode: 404, message: 'User not found', error: 'Not Found' });
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const duplicate = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (duplicate) {
        throw new ConflictException({ statusCode: 409, message: 'Email already in use', error: 'Conflict' });
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const pepper = process.env.PEPPER ?? '';
      user.password = await bcrypt.hash(updateUserDto.password + pepper, 10);
    }

    if (updateUserDto.job_title !== undefined) {
      user.job_title = updateUserDto.job_title;
    }

    if (updateUserDto.language !== undefined) {
      user.language = updateUserDto.language;
    }

    if (updateUserDto.theme_mode !== undefined) {
      user.theme_mode = updateUserDto.theme_mode;
    }

    await this.userRepository.save(user);
    return { message: 'User updated', data: this.serialize(user) };
  }

  async remove(user_id: number) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException({ statusCode: 404, message: 'User not found', error: 'Not Found' });
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted', data: { user_id } };
  }

  private serialize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}

