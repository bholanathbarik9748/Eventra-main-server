import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDTO } from './profile.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';

@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
