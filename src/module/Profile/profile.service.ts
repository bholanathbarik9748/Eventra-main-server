import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateProfileDTO } from './profile.dto';
import { UserProfile } from './profile.type';

@Injectable()
export class ProfileService {
  constructor(
    private entityManager: EntityManager, // Inject EntityManager for raw SQL queries
  ) {}

  async getUserProfile(id: string): Promise<{ data: UserProfile }> {
    try {
      const response = await this.entityManager.query(
        'SELECT * FROM "profile" WHERE id = $1',
        [id],
      );

      if (!response) {
        throw new ConflictException('No Profile');
      }

      const data: UserProfile = {
        email: response[0].email,
        location: response[0].location,
        name: response[0].name,
        bio: response[0].bio,
        date_of_birth: response[0].date_of_birth,
        phone_number: response[0].phone_number,
        profile_picture: response[0].profile_picture,
      };
      return { data };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createUserProfile(id: string, body: CreateProfileDTO): Promise<void> {
    try {
      await this.entityManager.query(
        'INSERT INTO "profile" (id, name, email, phone_number, location, profile_picture,bio,date_of_birth) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [
          id,
          body.name,
          body.email,
          body.phone_number,
          body.location,
          body.profile_picture,
          body.bio,
          body.date_of_birth,
        ],
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUserProfile(
    id: string,
    body: Partial<CreateProfileDTO>,
  ): Promise<void> {
    try {
      // Extract valid keys and values dynamically
      const entries = Object.entries(body).filter(
        ([_, value]) => value !== undefined && value !== null,
      );

      // If no valid fields to update, throw an error
      if (entries.length === 0) {
        throw new BadRequestException('No fields provided to update');
      }

      // Build SET clause dynamically
      const setClause = entries
        .map(([key], index) => `${key} = $${index + 2}`)
        .join(', ');

      // Prepare query and values
      const query = `
      UPDATE "profile"
      SET ${setClause}
      WHERE id = $1
      RETURNING *;
    `;

      const values = [id, ...entries.map(([_, value]) => value)];

      // Execute the query
      await this.entityManager.query(query, values);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserProfile(id: string): Promise<void> {
    try {
      await this.entityManager.query(
        'UPDATE "profile" SET is_active = false WHERE id = $1',
        [id],
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkProfileSetup(id: string): Promise<boolean> {
    try {
      const response = await this.entityManager.query(
        'SELECT * FROM "profile" WHERE id=$1',
        [id],
      );
      return response.length > 0;
    } catch (error) {
      throw error;
    }
  }
}
