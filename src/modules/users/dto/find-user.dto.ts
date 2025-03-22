import { IsUUID } from 'class-validator';

export class FindUserDto {
  @IsUUID()
  userId: string;
}
