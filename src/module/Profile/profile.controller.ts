import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDTO } from './profile.dto';

@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getUserProfile(@Param('id') id: string): Promise<any> {
    try {
      const response = await this.profileService.getUserProfile(id);
      return {
        status: 'success',
        data: response?.data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post(':id')
  async createUserProfile(
    @Param('id') id: string,
    @Body() body: CreateProfileDTO,
  ): Promise<any> {
    try {
      await this.profileService.createUserProfile(id, body);
      return {
        status: 'success',
        message: 'Profile setup successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() body: CreateProfileDTO,
  ): Promise<any> {
    try {
      await this.profileService.updateUserProfile(id, body);
      return {
        status: 'success',
        message: 'Profile update successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteUserProfile(@Param('id') id: string): Promise<any> {
    try {
      await this.profileService.deleteUserProfile(id);
      return {
        status: 'success',
        message: 'Profile deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/check/:id')
  async getCheckUser(@Param('id') id: string): Promise<any> {
    try {
      const response = await this.profileService.checkProfileSetup(id);
      return {
        status: 'success',
        isProfileSetUp: response,
      };
    } catch (error) {
      throw error;
    }
  }
}
