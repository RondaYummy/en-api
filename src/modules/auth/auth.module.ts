import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { UserSessionsRepository } from './user_sessions.repository';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService, UserSessionsRepository],
  controllers: [AuthController],
  exports: [AuthService, UserSessionsRepository],
})
export class AuthModule { }
