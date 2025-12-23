import {IsEmail, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class AuthDto {
  @IsOptional()
  @IsString()
  @MinLength(3, {message: 'Full name must be at least 3 characters long'})
  @MaxLength(32, {message: 'Full name must be at most 32 characters long'})
  fullName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {message: 'Password must be at least 6 characters long'})
  password: string;
}