import { OmitType } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  user_id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  questions: string[];

  @IsString()
  status: string;

  @IsString()
  user_lang: string;

  @IsString()
  lang: string;

  @IsString()
  level: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  available_days: number[];

  @IsNumber()
  month: number;
}

export class CreateApiCourseDto extends OmitType(CreateCourseDto, ['title', 'status', 'description', 'questions'] as const) { }
