import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateProfileDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  profile_picture: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Date of birth must be in DD-MM-YYYY format',
  })
  date_of_birth: string;
}

export class updateProfileDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  profile_picture: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Date of birth must be in DD-MM-YYYY format',
  })
  date_of_birth: string;
}
