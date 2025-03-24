import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserSessionsRepository } from './user_sessions.repository';
import { randomBytes } from 'crypto';
import { UserSessionDto } from './dto/user_session.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) { }

  async register(registerDto: RegisterDto) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(registerDto.password, salt, 64, { N: 1024 }).toString('hex');

    await this.usersService.create({
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      email: registerDto.email,
      username: registerDto.username,
      hash: hash,
      salt: salt,
    });
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string): Promise<UserSessionDto> {
    const userCredentials = await this.usersService.findCredentials(loginDto.username);
    if (!userCredentials) throw new UnauthorizedException();
    const token = randomBytes(64).toString('hex');
    const session = await this.userSessionsRepository.findByIp(ip);
    if (session) {
      return session;
    }
    // const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return await this.userSessionsRepository.create({
      user_id: userCredentials.user_id,
      session_token: token,
      ip_address: ip,
      is_active: true,
      user_agent: userAgent,
      expires_at: expiresAt,
      permissions: ['all'],
    });
  }
}

