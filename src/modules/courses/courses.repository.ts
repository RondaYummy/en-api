import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Drizzle, InjectDrizzle } from '../drizzle/drizzle.module';
import { courses } from './entities/courses.schema';
import { lessons } from './entities/lesson.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { computeScheduledDate } from 'src/utils/date.utils';

@Injectable()
export class CoursesRepository {
  constructor(@InjectDrizzle() private readonly db: Drizzle) {}

  async createCourse(course: CreateCourseDto, userId: string) {
    return await this.db.transaction(async (tx) => {
      const [savedCourse] = await tx
        .insert(courses)
        .values({
          title: course.title,
          description: course.description,
          level: course.level,
          month: course.month,
          lang: course.lang,
          user_id: userId,
          created_at: new Date(),
          user_lang: course.user_lang,
          available_days: course.available_days,
          status: 'active'
        })
        .returning();

      const courseStart = new Date(savedCourse.created_at);

      for (let idx = 0; idx < course.lessons.length; idx++) {
        const lesson = course.lessons[idx];
        const scheduledDate = computeScheduledDate(courseStart, course.available_days, idx);

        await tx.insert(lessons).values({
          lesson_number: idx + 1,
          course_id: savedCourse.id,
          controlQuestion: lesson.controlQuestion,
          plan: lesson.plan,
          title: lesson.title,
          review: '',
          homework: '',
          answer: '',
          user_id: userId,
          scheduled_date: scheduledDate,
        });
      }

      return savedCourse;
    });
  }

  async findCourses(userId: string) {
    const result = await this.db.select().from(courses).where(eq(courses.user_id, userId));
    return result;
  }

  async findCourse(userId: string, courseId: string) {
    const rows = await this.db
      .select()
      .from(courses)
      .innerJoin(lessons, eq(courses.id, lessons.course_id))
      .where(and(eq(lessons.course_id, courseId), eq(lessons.user_id, userId)));
    if (!rows.length) {
      return null;
    }

    const course = { ...rows[0].courses, lessons: [] as (typeof rows)[0]['lessons'][] };
    rows.forEach((row) => {
      course.lessons.push(row.lessons);
    });
    return course;
  }

  async findActiveCourses(userId: string) {
    const coursesData = await this.db
      .select()
      .from(courses)
      .where(and(eq(courses.user_id, userId), eq(courses.status, 'active')));

    const coursesWithLessons = await Promise.all(
      coursesData.map(async (course) => {
        const courseLessons = await this.db.select().from(lessons).where(eq(lessons.course_id, course.id));
        return { ...course, lessons: courseLessons };
      }),
    );

    return coursesWithLessons;
  }

  async findCompletedCourses(userId: string) {
    const coursesData = await this.db
      .select()
      .from(courses)
      .where(and(eq(courses.user_id, userId), eq(courses.status, 'completed')));

    const coursesWithLessons = await Promise.all(
      coursesData.map(async (course) => {
        const courseLessons = await this.db.select().from(lessons).where(eq(lessons.course_id, course.id));
        return { ...course, lessons: courseLessons };
      }),
    );

    return coursesWithLessons;
  }

  async updateCourse(userId: string, updateUserDto: UpdateCourseDto) {
    await this.db.update(courses).set(updateUserDto).where(eq(courses.user_id, userId));
    return this.findCourses(userId);
  }

  async createLesson(createLessonDto: CreateLessonDto) {
    const [insertedLesson] = await this.db.insert(lessons).values(createLessonDto).returning();
    return insertedLesson;
  }

  async findLessonsByCourse(courseId: string, userId: string) {
    const result = await this.db
      .select()
      .from(lessons)
      .where(and(eq(lessons.course_id, courseId), eq(lessons.user_id, userId)));
    return result;
  }

  async findLessonById(lessonId: string, userId: string) {
    const result = await this.db
      .select()
      .from(lessons)
      .where(and(eq(lessons.id, lessonId), eq(lessons.user_id, userId)));
    return result[0];
  }

  async updateLesson(lessonId: string, updateLessonDto: UpdateLessonDto, userId: string) {
    await this.db.update(lessons).set(updateLessonDto).where(eq(lessons.id, lessonId));
    return this.findLessonById(lessonId, userId);
  }
}
