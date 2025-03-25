import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';

export const userSessions = pgTable(
  'user_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull(),
    session_token: varchar('session_token', { length: 128 }).notNull().unique(),
    user_agent: varchar('user_agent', { length: 255 }),
    ip_address: varchar('ip_address', { length: 45 }).unique(),
    is_active: boolean('is_active').default(true).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    expires_at: timestamp('expires_at', { withTimezone: true }),
    permissions: text('permissions')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
  }
);
