import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from '../../configs/logger.config';
import { typeormConfig } from '../../configs/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';
import { CoursesModule } from '../courses/courses.module';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { SpeechModule } from '../speech/speech.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync(pinoConfig),
    TypeOrmModule.forRootAsync(typeormConfig),
    AuthModule,
    PaymentModule,
    CoursesModule,
    OpenAiModule,
    SpeechModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
