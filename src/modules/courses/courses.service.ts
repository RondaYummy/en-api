import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { OpenAiService } from '../open-ai/open-ai.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly openAiService: OpenAiService,
  ) { }

  async createCourse(data: CreateCourseDto) {
    await this.openAiService.createCoursePlan(data.user_lang, data.lang, data.month, data.available_days?.length);
  }
}
