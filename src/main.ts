import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { useSwagger } from './configs/swagger.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: [
      'http://localhost:9150',
      'http://localhost:3020',
      'https://levych.com',
      process.env.FRONTEND_URL.slice(0, 26),
      process.env.FRONTEND_DOMAIN,
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.disable('x-powered-by').disable('etag');

  useSwagger(app);

  await app.listen(Number(process.env.PORT));
  console.log(`🟢 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
