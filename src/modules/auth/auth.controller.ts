import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@Controller('')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'User Registration', description: 'Registers a new user with the provided details.' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() createUserDto: RegisterDto) {
    this.logger.log('New registration', createUserDto.username);
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login', description: 'Authenticates a user and sets a session cookie on successful login.' })
  @ApiResponse({ status: 200, description: 'Login successful, session cookie set.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginUserDto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    if (!ipAddress || !userAgent) {
      return;
    }
    if (Array.isArray(ipAddress)) {
      ipAddress = ipAddress[0];
    }
    this.logger.log(`New log in from ip: "${ipAddress}".`, loginUserDto.username);
    this.logger.log(`User-Agent: "${userAgent}".`);
    const frontendDomain = this.configService.get<string>('FRONTEND_DOMAIN');
    const session = await this.authService.login(loginUserDto, ipAddress, userAgent);

    const twoMonths = 660 * 24 * 60 * 60 * 1000;
    const days = new Date();
    days.setDate(days.getMonth() + 12);

    res.cookie('session_token', session.session_token, {
      httpOnly: true,
      domain: frontendDomain,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: twoMonths, // 60 днів
      // expires: days,
      path: '/',
    });

    return await this.usersService.find({ userId: session.user_id });
  }
}
