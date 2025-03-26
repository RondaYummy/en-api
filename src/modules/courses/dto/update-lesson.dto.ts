import { Type } from 'class-transformer';
import { IsUUID, IsString, IsOptional, MaxLength, IsNumber, IsNotEmpty, IsDate } from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  course_id?: string;

  @IsNumber()
  @IsNotEmpty()
  lesson_number: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(510)
  plan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(510)
  answer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(510)
  review?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  controlQuestion?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduled_date: Date;
}
