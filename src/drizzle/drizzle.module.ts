import { Global, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';

export const DrizzleToken = Symbol('DrizzleToken');
export const NodePostgresToken = Symbol('NodePostgresToken');

export const InjectDrizzle = () => Inject(DrizzleToken);

export type Drizzle = ReturnType<typeof drizzle>;

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: NodePostgresToken,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.get('DATABASE_URL'),
          min: 0,
          max: 300,
          connectionTimeoutMillis: 5000,
          ssl: config.get('USE_SSL_FOR_DATABASE')
            ? {
              rejectUnauthorized: true,
              ca: readFileSync(config.get('USE_SSL_FOR_DATABASE')!),
            }
            : undefined,
        });
        return pool;
      },
    },
    {
      provide: DrizzleToken,
      inject: [NodePostgresToken],
      useFactory: (pool: Pool) => {
        const db: Drizzle = drizzle({
          client: pool,
          casing: 'snake_case',
        });
        return db;
      },
    },
  ],
  exports: [DrizzleToken],
})
export class DrizzleModule { }
