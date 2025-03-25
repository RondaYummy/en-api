import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const chats = pgTable('chats', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull(),
  course_id: uuid('course_id').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  question: text('question').notNull(),
  answear: text('answear').notNull(), // user responses
  review: text('review').notNull() // AI response to the user's answer (correctness, recommendations, etc.)
});
