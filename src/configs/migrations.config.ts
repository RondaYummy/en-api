import 'dotenv/config';
import * as path from 'path';

import { DataSourceOptions } from 'typeorm';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  entities: [path.join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  subscribers: [path.join(__dirname, '..', 'modules', '**', '*.subscriber.{ts,js}')],
  uuidExtension: 'uuid-ossp',
  logging: 'all',
  logger: 'advanced-console',
  useUTC: true,
};

