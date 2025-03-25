import { IsString, IsArray, ArrayNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsNumber()
  month: number;

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
}
