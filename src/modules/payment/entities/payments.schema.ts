import { pgTable, uuid, text, timestamp, varchar, numeric } from 'drizzle-orm/pg-core';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull(),
  // If you sell courses, you can use course_id, or for subscriptions, subscription_id
  course_id: uuid('course_id').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(), // For example, 99999999.99
  currency: varchar('currency', { length: 8 }).notNull(), // For example, 'USD', 'UAH'
  status: varchar('status', { length: 32 }).notNull(), // Status: pending, paid, cancelled, refunded, etc.
  description: text('description'), // Optional - additional information
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
