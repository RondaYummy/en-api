import { Injectable } from '@nestjs/common';
import { CreateApiCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { OpenAiService } from '../open-ai/open-ai.service';
import { CoursesRepository } from './courses.repository';
import { computeScheduledDate } from 'src/utils/date.utils';

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
    const courseStart = new Date(savedCourse.created_at);
    await Promise.all(lessons.map(async (lesson, idx) => {
      const scheduledDate = computeScheduledDate(courseStart, course.available_days, idx);
      await this.coursesRepository.createLesson({
        lesson_number: idx + 1,
        course_id: savedCourse.id,
        controlQuestion: lesson.controlQuestion,
        plan: lesson.plan,
        title: lesson.title,
        review: '',
        answer: '',
        user_id: userId,
        scheduled_date: scheduledDate,
      });
    }));
    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    return await this.coursesRepository.createCourse(createCourseDto);
  }

  async findCoursesWithLessons(userId: string) {
    return await this.coursesRepository.findCoursesWithLessons(userId);
  }

  async getUserCourseLessons(userId: string) {
    return await this.coursesRepository.findCourses(userId);
  }

  async findLessonsByCourse(courseId: string, userId: string) {
    return await this.coursesRepository.findLessonsByCourse(courseId, userId);
  }

  async answerLessonQuestion(courseId: string, userId: string, lessonId: string) {
    const course = await this.coursesRepository.findCourse(userId, courseId);
    const lessons = await this.coursesRepository.findLessonsByCourse(courseId, userId);
    console.log(course, 'course');
    console.log(lessons, 'lessons');
  }

  async createLessonContent(courseId: string, userId: string, lessonId: string) {
    let lesson = await this.coursesRepository.findLessonById(lessonId, userId);
    const content = await this.openAiService.createLessonContent(lesson.plan, lesson.controlQuestion);
    lesson.content = content.lessonContent;
    const lessonUpdated = await this.coursesRepository.updateLesson(lessonId, lesson, userId);
    console.log(lessonUpdated, 'lessonUpdated');
    return await this.coursesRepository.findLessonById(lessonId, userId);
  }
}
