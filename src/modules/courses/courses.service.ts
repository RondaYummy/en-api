import { Injectable } from '@nestjs/common';
import { CreateApiCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { OpenAiService } from '../open-ai/open-ai.service';
import { CoursesRepository } from './courses.repository';

export interface Lesson {
  plan: string;
  controlQuestion: string;
  title: string;
}

@Injectable()
export class CoursesService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly coursesRepository: CoursesRepository,
  ) { }

  async createCourse(data: CreateApiCourseDto, userId: string) {
    const course = await this.openAiService.createCoursePlan(data.user_lang, data.lang, data.month, data.available_days, data.level, userId);
    const savedCourse = await this.create(course);

    const lessons: Lesson[] = course.lessons;
    await Promise.all(lessons.map(async (lesson, idx) => {
      await this.coursesRepository.createLesson({
        lesson_number: idx + 1,
        course_id: savedCourse.id,
        controlQuestion: lesson.controlQuestion,
        plan: lesson.plan,
        title: lesson.title,
        review: '',
        answer: '',
        user_id: userId,
      });
    }));
    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    return await this.coursesRepository.createCourse(createCourseDto);
  }

  async getUserCourse(userId: string) {
    return await this.coursesRepository.findCourse(userId);
  }

  async findCoursesWithLessons(userId: string) {
    return await this.coursesRepository.findCoursesWithLessons(userId);
  }

  async getUserCourseLessons(userId: string) {
    return await this.coursesRepository.findCourse(userId);
  }

  async findLessonsByCourse(courseId: string, userId: string) {
    return await this.coursesRepository.findLessonsByCourse(courseId, userId);
  }
}
