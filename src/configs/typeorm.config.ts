import * as path from 'path';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: Number(configService.get('DB_PORT')) || 5432,
    database: configService.get('DB_DATABASE'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    schema: configService.get('DB_SCHEMA'),
    entities: [path.join(__dirname, '..', 'modules', '**', 'entities', '*.entity.{ts,js}')],
  }),
};
