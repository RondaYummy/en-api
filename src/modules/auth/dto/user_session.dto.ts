import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  Length,
} from 'class-validator';

export class UserSessionDto {
  @IsUUID()
  user_id: string;

  @IsString()
  @Length(1, 128)
  session_token: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  user_agent: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 45)
  ip_address: string | null;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsDateString()
  expires_at: Date | null;

  @IsUUID()
  id?: string;

  @IsDateString()
  created_at?: Date;

  @IsOptional()
  @IsDateString()
  updated_at?: Date | null;
}

