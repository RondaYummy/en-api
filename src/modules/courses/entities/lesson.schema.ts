import { pgTable, uuid, timestamp, varchar, boolean, integer, text } from 'drizzle-orm/pg-core';
import { users } from 'src/modules/users/entities/users.schema';
import { courses } from './courses.schema';

export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  course_id: uuid('course_id').notNull().references(() => courses.id),
  title: varchar('title', { length: 64 }).notNull(),
  plan: varchar('plan', { length: 510 }).notNull(),
  lesson_number: integer('lesson_number').notNull(),
  answer: varchar('answer', { length: 510 }).notNull(), // user responses
  review: varchar('review', { length: 510 }).notNull(), // AI response to the user's answer (correctness, recommendations, etc.)
  controlQuestion: varchar('controlQuestion', { length: 255 }).notNull(), // Control question for ending lesson for user
  done: boolean().default(false).notNull(),
  content: text('content'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  scheduled_date: timestamp('scheduled_date', { withTimezone: true }).notNull(),
});
