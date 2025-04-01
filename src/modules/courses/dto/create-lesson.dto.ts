import { Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';

export class CreateLessonDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  lesson_number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8160)
  plan: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8160)
  answer: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8160)
  homework: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8160)
  review: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  controlQuestion: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduled_date: Date;
}
