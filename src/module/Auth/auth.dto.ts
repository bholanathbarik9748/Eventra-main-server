import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from './auth.enum';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class signUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class forgotPasswordRequestDto {
  @IsEmail()
  email: string;
}

export class PasswordChangeDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  otp: string;
}
