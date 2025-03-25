import { IsUUID, IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateLessonDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  lesson_number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(510)
  plan: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(510)
  answer: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(510)
  review: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  controlQuestion: string;
}
