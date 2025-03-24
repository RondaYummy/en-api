import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    first_name: varchar('first_name', { length: 64 }).notNull(),
    last_name: varchar('last_name', { length: 64 }).notNull(),

    email: varchar('email', { length: 64 }).notNull().unique(),

    username: varchar('username', { length: 32 }).notNull().unique(),

    hash: varchar('hash', { length: 128 }).notNull(),
    salt: varchar('salt', { length: 32 }).notNull(),

    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  }
);
