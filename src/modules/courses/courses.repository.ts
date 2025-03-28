import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Drizzle, InjectDrizzle } from '../drizzle/drizzle.module';
import { courses } from './entities/courses.schema';
import { lessons } from './entities/lesson.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class CoursesRepository {
  constructor(@InjectDrizzle() private readonly db: Drizzle) { }

  async createCourse(createCourseDto: CreateCourseDto) {
    const [insertedCourse] = await this.db
      .insert(courses)
      .values(createCourseDto)
      .returning();
    return insertedCourse;
  }

  async findCourses(userId: string) {
    const result = await this.db
      .select()
      .from(courses)
      .where(eq(courses.user_id, userId));
    return result;
  }

  async findCourse(userId: string, courseId: string) {
    const result = await this.db
      .select()
      .from(courses)
      .where(and(eq(lessons.course_id, courseId), eq(lessons.user_id, userId)));
    return result;
  }
  
  async findActiveCourses(userId: string) {
    const coursesData = await this.db
      .select()
      .from(courses)
      .where(and(eq(courses.user_id, userId), eq(courses.status, 'active')));

    const coursesWithLessons = await Promise.all(
      coursesData.map(async (course) => {
        const courseLessons = await this.db
          .select()
          .from(lessons)
          .where(eq(lessons.course_id, course.id));
        return { ...course, lessons: courseLessons };
      })
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
        const courseLessons = await this.db
          .select()
          .from(lessons)
          .where(eq(lessons.course_id, course.id));
        return { ...course, lessons: courseLessons };
      })
    );

    return coursesWithLessons;
  }

  async updateCourse(userId: string, updateUserDto: UpdateCourseDto) {
    await this.db
      .update(courses)
      .set(updateUserDto)
      .where(eq(courses.user_id, userId));
    return this.findCourses(userId);
  }

  async createLesson(createLessonDto: CreateLessonDto) {
    const [insertedLesson] = await this.db
      .insert(lessons)
      .values(createLessonDto)
      .returning();
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
    await this.db
      .update(lessons)
      .set(updateLessonDto)
      .where(eq(lessons.id, lessonId));
    return this.findLessonById(lessonId, userId);
  }
}
