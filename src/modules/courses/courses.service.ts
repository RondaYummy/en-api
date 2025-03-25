import { Injectable } from '@nestjs/common';
import { CreateApiCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { OpenAiService } from '../open-ai/open-ai.service';
import { CoursesRepository } from './courses.repository';

@Injectable()
export class CoursesService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly coursesRepository: CoursesRepository,
  ) { }

  async createCourse(data: CreateApiCourseDto) {
    const course = await this.openAiService.createCoursePlan(data.user_lang, data.lang, data.month, data.available_days, data.level);
    return await this.create(course);
  }

  async create(createCourseDto: CreateCourseDto) {
    return await this.coursesRepository.create(createCourseDto);
  }

  async getUserCourse() {
    // return await this.coursesRepository.create(createCourseDto);
  }
}
