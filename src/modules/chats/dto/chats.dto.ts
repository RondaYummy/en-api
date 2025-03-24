import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  ansver: string;

  @IsString()
  @IsNotEmpty()
  review: string;
}

export class UpdateChatDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  course_id?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  ansver?: string;

  @IsOptional()
  @IsString()
  review?: string;
}
