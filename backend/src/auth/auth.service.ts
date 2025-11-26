import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private static instance: AuthService;

  constructor(private readonly usersService: UsersService) {
    if (!AuthService.instance) {
      AuthService.instance = this;
    }
    return AuthService.instance;
  }

  async register(registerDto: RegisterDto) {
    try {
      await this.usersService.create(registerDto);
    } catch (error) {
      if (error?.status === 409) {
        throw new ConflictException(error.response);
      }
      throw error;
    }
    return { message: 'Registered successfully. Please login.', data: null };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({ statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' });
    }

    const pepper = process.env.PEPPER ?? '';
    const isMatch = await bcrypt.compare(loginDto.password + pepper, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' });
    }

    const { password, ...rest } = user;
    return { message: 'Login successful', data: rest };
  }
}

