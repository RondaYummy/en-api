import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    this.logger.log('New registration', createUserDto.username);
    return this.authService.register(createUserDto);
  }

  @Post('login')
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
    const session = await this.authService.login(loginUserDto, ipAddress, userAgent);
    res.cookie('session_token', session.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // or 'strict'
      // maxAge: 
      // expires: 
    });

    return { message: 'Login successful!' };
  }
}
