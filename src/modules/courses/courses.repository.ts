import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Drizzle, InjectDrizzle } from '../drizzle/drizzle.module';
import { courses } from './entities/courses.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesRepository {
  constructor(@InjectDrizzle() private readonly db: Drizzle) { }

  async create(createCourseDto: CreateCourseDto) {
    const [insertedCourse] = await this.db
      .insert(courses)
      .values(createCourseDto)
      .returning();
    return insertedCourse;
  }

  async find(userId: string) {
    const result = await this.db
      .select()
      .from(courses)
      .where(eq(courses.id, userId));
    return result[0];
  }

  async update(userId: string, updateUserDto: UpdateCourseDto) {
    await this.db
      .update(courses)
      .set(updateUserDto)
      .where(eq(courses.id, userId));
    return this.find(userId);
  }
}
