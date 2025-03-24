import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from '../../configs/logger.config';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';
import { CoursesModule } from '../courses/courses.module';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { SpeechModule } from '../speech/speech.module';
import { UsersModule } from '../users/users.module';
import { DrizzleModule } from 'src/modules/drizzle/drizzle.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync(pinoConfig),
    AuthModule,
    PaymentModule,
    CoursesModule,
    OpenAiModule,
    SpeechModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
