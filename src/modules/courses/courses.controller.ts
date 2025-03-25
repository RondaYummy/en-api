import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateApiCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { Permissions } from 'src/decorators/session-permissions.decorator.ts';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

  @Post('create')
  @Permissions()
  async createCourse(@Body() createCourseDto: CreateApiCourseDto) {
    return await this.coursesService.createCourse(createCourseDto);
  }

  @Post()
  @Permissions()
  async getUserCourse() {
    return await this.coursesService.getUserCourse();
  }
}
