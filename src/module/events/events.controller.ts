import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDto, updateEventDto } from './events.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { OrganizerGuard } from 'src/common/Guard/Organizer.guard';

@Controller('/organizer')
@UseGuards(AuthGuard, OrganizerGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/:organizer_id/event')
  async getAllEventsController(
    @Param('organizer_id') organizer_id: string,
  ): Promise<any> {
    try {
      const response = await this.eventsService.allEvents(organizer_id);
      return {
        status: 'success',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/:organizer_id/event')
  async createEventsController(
    @Param('organizer_id') organizer_id: string,
    @Body() body: CreateEventsDto,
  ): Promise<any> {
    try {
      const response = await this.eventsService.createEvents(
        organizer_id,
        body,
      );
      return {
        status: 'success',
        message: 'Events create successfully',
        data: {
          event_id: response.event_id,
        },
      };
    } catch (error) {
      console.error('/events ---->', error);
      throw error;
    }
  }

  @Get('/:organizer_id/event/:event_id')
  async getSingleEventsController(
    @Param('organizer_id') organizer_id: string,
    @Param('event_id') event_id: string,
  ): Promise<any> {
    try {
      const response = await this.eventsService.singleEvents(
        organizer_id,
        event_id,
      );
      return {
        status: 'success',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('/:organizer_id/event/:event_id')
  async updateEventsController(
    @Param('organizer_id') organizer_id: string,
    @Param('event_id') event_id: string,
    @Body() body: updateEventDto,
  ): Promise<any> {
    try {
      await this.eventsService.updateEvents(organizer_id, event_id, body);
      return {
        status: 'success',
        message: 'Event update successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
