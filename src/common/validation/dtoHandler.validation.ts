import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const globalDtoHandler = async (Dto: any, body: any, res: any) => {
  // Transform plain body into the DTO instance
  const createAuthDto = plainToInstance(Dto, body);

  // Validate the DTO
  const errors = await validate(createAuthDto);

  if (errors.length > 0) {
    // If validation errors exist, return them
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      })),
    });
  }

  // If no errors, return the validated DTO
  return false;
};
