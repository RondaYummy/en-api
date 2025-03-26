import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';
import { IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'First name of the user', minLength: 1, maxLength: 64 })
  @IsString()
  @Length(1, 64)
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', minLength: 1, maxLength: 64 })
  @IsString()
  @Length(1, 64)
  last_name: string;

  @ApiProperty({ description: 'Username of the user', minLength: 8, maxLength: 32 })
  @IsString()
  @Length(8, 32)
  username: string;

  @ApiProperty({ description: 'Password of the user', minLength: 8 })
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  password: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  email: string;
}
