import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  Length,
  IsArray,
} from 'class-validator';

export class UserSessionDto {
  @ApiProperty({ description: 'User ID', example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Session token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  @Length(1, 128)
  session_token: string;

  @ApiPropertyOptional({ description: 'User agent string', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  user_agent: string | null;

  @ApiPropertyOptional({ description: 'IP address of the user', example: '192.168.1.1' })
  @IsOptional()
  @IsString()
  @Length(0, 45)
  ip_address: string | null;

  @ApiPropertyOptional({ description: 'Indicates if the session is active', example: true })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiPropertyOptional({ description: 'Expiration date of the session in ISO format', example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expires_at: Date | null;

  @ApiPropertyOptional({ description: 'Unique identifier for the session (if provided)', example: 'c2d5bfb8-84b2-4d70-b7f6-9b6f3a7c0cbb' })
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Creation date of the session in ISO format', example: '2025-03-26T10:18:13.015Z' })
  @IsDateString()
  created_at?: Date;

  @ApiPropertyOptional({ description: 'Last update date of the session in ISO format', example: '2025-03-26T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  updated_at?: Date | null;

  @ApiProperty({ description: 'List of permissions associated with the session', example: ['read', 'write'] })
  @IsArray()
  permissions: string[];
}
