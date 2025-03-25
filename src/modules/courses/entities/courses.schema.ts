import { pgTable, uuid, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull(),
  title: varchar('title', { length: 64 }).notNull(),
  description: varchar('description', { length: 512 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  status: varchar('status', { length: 32 }).notNull(), // Course status (active, completed, draft, etc.)
  user_lang: varchar('user_lang', { length: 32 }).notNull(), // User language (for example, “en”, “uk”)
  lang: varchar('lang', { length: 32 }).notNull(), // Course language (for example, “en”, “uk”)
  level: varchar('level', { length: 32 }).notNull(), // Course level (beginner, intermediate, advanced)
  available_days: integer('available_days').array().notNull() // Array of numbers (days of the week) when the task is available
});
