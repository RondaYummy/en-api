import { Injectable } from '@nestjs/common';
import { CreateApiCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { OpenAiService } from '../open-ai/open-ai.service';
import { CoursesRepository } from './courses.repository';
import { computeScheduledDate } from 'src/utils/date.utils';
import { AnswerLessonDto } from './dto/answer-question.dto';

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
    const savedCourse = await this.coursesRepository.createCourse(course, userId);
    return savedCourse;
  }

  async findActiveCourses(userId: string) {
    return await this.coursesRepository.findActiveCourses(userId);
  }

  async findCompletedCourses(userId: string) {
    return await this.coursesRepository.findCompletedCourses(userId);
  }
  
  async getUserCourseLessons(userId: string) {
    return await this.coursesRepository.findCourses(userId);
  }

  async getUserCourse(userId: string, courseId: string) {
    return await this.coursesRepository.findCourse(userId, courseId);
  }

  async findLessonsByCourse(courseId: string, userId: string) {
    return await this.coursesRepository.findLessonsByCourse(courseId, userId);
  }

  async answerLessonQuestion(userId: string, lessonId: string, body: AnswerLessonDto) {
    const lesson = await this.coursesRepository.findLessonById(lessonId, userId);
    const reviewAi = await this.openAiService.answerLessonQuestion(lesson.plan, lesson.controlQuestion, body.answer);
    lesson.review = reviewAi.review;
    lesson.done = true;
    const lessonUpdated = await this.coursesRepository.updateLesson(lessonId, lesson, userId);
    return lessonUpdated;
  }

  async createLessonContent(userId: string, lessonId: string) {
    let lesson = await this.coursesRepository.findLessonById(lessonId, userId);
    const course = await this.getUserCourse(userId, lesson.course_id);
    if (!course?.user_lang || course?.lang) {
      return null;
    }
    const content = await this.openAiService.createLessonContent(lesson.plan, lesson.controlQuestion, course?.user_lang, course?.lang);
    lesson.content = content.lessonContent;
    const lessonUpdated = await this.coursesRepository.updateLesson(lessonId, lesson, userId);
    return lessonUpdated;
  }
}
