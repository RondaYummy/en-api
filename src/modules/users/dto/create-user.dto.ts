import { OmitType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';


export class CreateUserDto extends OmitType(RegisterDto, ['password'] as const) {
  @IsString()
  @Length(128, 128)
  hash: string;

  @IsString()
  @Length(32, 32)
  salt: string;
}
