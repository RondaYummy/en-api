import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { OpenAiModule } from '../open-ai/open-ai.module';

@Module({
  imports: [OpenAiModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule { }
