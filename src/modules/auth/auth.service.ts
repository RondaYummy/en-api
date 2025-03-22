import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async register(registerDto: RegisterDto) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(registerDto.password, salt, 64, { N: 1024 }).toString('hex');

    await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      username: registerDto.username,
      hash: hash,
      salt: salt,
    });
  }

  async login(loginDto: LoginDto) {
    const userCredentials = false;

    if (!userCredentials) throw new UnauthorizedException();

  }
}
