import {
  IsEmail,
  IsNotEmpty, // Correct decorator
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateEventsDto {
  @IsNotEmpty({ message: 'Event title is required' })
  @IsString({ message: 'Event title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsString({ message: 'Date must be a valid string' })
  date: string;

  @IsNotEmpty({ message: 'Venue is required' })
  @IsString({ message: 'Venue must be a string' })
  venue: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsNotEmpty({ message: 'Capacity is required' })
  @IsNumber({}, { message: 'Capacity must be a number' })
  capacity: number;

  @IsNotEmpty({ message: 'Available seats are required' })
  @IsNumber({}, { message: 'Available seats must be a number' })
  available_seats: number;
}

export class updateEventDto {
  @IsOptional()
  @IsString({ message: 'title must be string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'description must be string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'capacity must be number' })
  capacity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'available_seats must be number' })
  available_seats?: number;

  @IsOptional()
  @IsNumber({}, { message: 'price must be number' })
  price: number;

  @IsOptional()
  @IsString({ message: 'Date must be a valid string' })
  date: string;
}
