import { pgTable, uuid, text, timestamp, varchar, numeric } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  payment_id: uuid('payment_id').notNull(), // FK to the payments table
  provider: varchar('provider', { length: 32 }).notNull(), // Name or identifier of the payment gateway
  provider_transaction_id: varchar('provider_transaction_id', { length: 64 }).notNull(), // Unique transaction identifier in the payment system
  status: varchar('status', { length: 32 }).notNull(), // Transaction status (for example, pending, authorized, succeeded, failed, refunded)
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(), // Amount written off
  currency: varchar('currency', { length: 8 }).notNull(), // Transaction currency (for example, 'USD', 'UAH')
  error_message: text('error_message'), // Error message if the transaction failed
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
