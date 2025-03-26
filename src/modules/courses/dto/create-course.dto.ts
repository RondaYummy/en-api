import { OmitType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'User identifier', example: 'd6a9b123-4c5d-6789-abcdef012345' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'Course title', example: 'Interactive English Course' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Course description', example: 'This course covers essential communication skills in English.' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Course status (e.g., active, completed, draft)', example: 'active' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'User language (native language of the user)', example: 'uk' })
  @IsString()
  user_lang: string;

  @ApiProperty({ description: 'Course language (language to be learned)', example: 'en' })
  @IsString()
  lang: string;

  @ApiProperty({ description: 'Course level (e.g., beginner, intermediate, advanced)', example: 'beginner' })
  @IsString()
  level: string;

  @ApiProperty({ description: 'Array of available days of the week (0 = Sunday, 6 = Saturday)', example: [1, 3, 5] })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  available_days: number[];

  @ApiProperty({ description: 'Duration of the course in months', example: 3 })
  @IsNumber()
  month: number;
}

export class CreateApiCourseDto extends OmitType(CreateCourseDto, ['title', 'status', 'description'] as const) { }
