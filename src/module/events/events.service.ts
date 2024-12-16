import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventsDto, updateEventDto } from './events.dto';
import { EntityManager } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class EventsService {
  constructor(
    private entityManager: EntityManager, // Inject EntityManager for raw SQL queries
  ) {}

  async allEvents(organizer_id: string): Promise<any> {
    try {
      const response = await this.entityManager.query(
        `SELECT * FROM "events" WHERE organizer_id = $1`,
        [organizer_id],
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createEvents(
    organizer_id: string,
    body: CreateEventsDto,
  ): Promise<{ event_id: string }> {
    try {
      const [response] = await this.entityManager.query(
        `
        INSERT INTO "events" (title, description, date, venue, price, capacity, available_seats, organizer_id)
        VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7, $8)
        RETURNING *
        `,
        [
          body.title,
          body.description,
          body.date,
          body.venue,
          body.price,
          body.capacity,
          body.available_seats,
          organizer_id,
        ],
      );
      return { event_id: response.event_id };
    } catch (error) {
      throw error;
    }
  }

  async singleEvents(organizer_id: string, event_id: string): Promise<any> {
    try {
      const response = await this.entityManager.query(
        `SELECT * FROM "events" WHERE organizer_id = $1 AND event_id = $2`,
        [organizer_id, event_id],
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateEvents(
    organizer_id: string,
    event_id: string,
    body: updateEventDto,
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
        .map(([key], index) => `${key} = $${index + 3}`)
        .join(', ');

      const query = `
          UPDATE "events"
          SET ${setClause}
          WHERE organizer_id = $1 AND event_id = $2
          RETURNING *;
        `;

      const values = [
        organizer_id,
        event_id,
        ...entries.map(([_, value]) => value),
      ];

      // Execute the query
      await this.entityManager.query(query, values);
    } catch (error) {
      throw error;
    }
  }
}
