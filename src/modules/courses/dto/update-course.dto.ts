import { IsOptional, IsString, IsArray, IsNumber, Min, Max } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  user_id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsString()
  user_lang: string;

  @IsString()
  lang: string;

  @IsString()
  level: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  available_days: number[];

  @IsNumber()
  month: number;
}
