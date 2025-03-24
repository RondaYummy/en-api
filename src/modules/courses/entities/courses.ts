import { pgTable, uuid, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull(),
  title: varchar('title', { length: 32 }).notNull(),
  description: varchar('description', { length: 128 }).notNull(),
  questions: text('questions').array().notNull(), // Array of ribbons for questions
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  status: varchar('status', { length: 32 }).notNull(), // Course status (active, completed, draft, etc.)
  lang: varchar('lang', { length: 32 }).notNull(), // Course language (for example, “en”, “uk”)
  level: varchar('level', { length: 32 }).notNull(), // Course level (beginner, intermediate, advanced)
  available_days: integer('available_days').array().notNull() // Array of numbers (days of the week) when the task is available
});
