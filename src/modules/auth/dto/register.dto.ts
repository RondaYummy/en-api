import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(1, 64)
  first_name: string;

  @IsString()
  @Length(1, 64)
  last_name: string;

  @IsString()
  @Length(8, 32)
  username: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  password: string;

  @IsEmail()
  email: string;
}
