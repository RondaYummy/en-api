import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateApiCourseDto } from './dto/create-course.dto';
import { Permissions } from 'src/decorators/session-permissions.decorator';
import { UserId } from '../../decorators/user-id.decorator';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

  @Post('create')
  @Permissions()
  async createCourse(@UserId() userId: string, @Body() createCourseDto: CreateApiCourseDto) {
    return await this.coursesService.createCourse(createCourseDto, userId);
  }

  @Get()
  @Permissions()
  async getUserCourse(@UserId() userId: string) {
    return await this.coursesService.findCoursesWithLessons(userId);
  }

  @Get('/:courseId/lessons')
  @Permissions()
  async getUserCourseLessons(@UserId() userId: string, @Param('courseId', ParseUUIDPipe) courseId: string) {
    return await this.coursesService.findLessonsByCourse(courseId, userId);
  }
}
