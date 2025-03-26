import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnswerLessonDto {
  @ApiProperty({
    description: 'Student answer to the control question',
    example: 'I would say Hello, my name is John.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(510)
  answer: string;
}
