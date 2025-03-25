import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { CoursesRepository } from './courses.repository';

@Module({
  imports: [OpenAiModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule { }
