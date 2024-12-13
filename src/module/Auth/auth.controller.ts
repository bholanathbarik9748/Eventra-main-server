import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, OtpDto, PasswordChangeDto, SignUpDto } from './auth.dto';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('/login')
  async userLogin(@Body() body: LoginDto): Promise<any> {
    try {
      const response = await this.userService.userLogin(body);
      return {
        status: 'success',
        message: 'User Login successfully',
        data: {
          userId: response.id,
          role: response.role,
          access_token: response.access_token,
        },
      };
    } catch (error) {
      console.error('/login ---->', error);
      throw error;
    }
  }

  @Post('/sign-up')
  async userSignUp(@Body() body: SignUpDto): Promise<any> {
    try {
      const response = await this.userService.userSignUp(body);
      return {
        status: 'success',
        message: 'User created successfully',
        data: {
          userId: response.userId,
          role: response.role,
          access_token: response.access_token,
        },
      };
    } catch (error) {
      console.error('/sign-up ---->', error);
      throw error;
    }
  }

  @Post('/otp-request')
  async userForgotPasswordRequest(@Body() body: OtpDto): Promise<any> {
    try {
      await this.userService.userOTPRequest(body);
      return {
        status: 'success',
        message: 'OTP send successfully',
      };
    } catch (error) {
      console.error('/otp-request error --->', error);
      throw error;
    }
  }

  @Post('/password-change')
  async userPasswordChange(@Body() body: PasswordChangeDto): Promise<any> {
    try {
      await this.userService.userPasswordChange(body);
      return {
        status: 'success',
        message:
          'Password changed successfully. You can now log in with your new password.',
      };
    } catch (error) {
      console.error('/password-change error --->', error);
      throw error;
    }
  }
}
