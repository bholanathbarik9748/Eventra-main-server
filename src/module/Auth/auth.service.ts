import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpDto, LoginDto, PasswordChangeDto, SignUpDto } from './auth.dto';
import { EntityManager } from 'typeorm';
import { UserRole } from './auth.enum';
import * as bcrypt from 'bcrypt';
import { AuthCommonServices } from 'src/common/services/auth.common.service';
import { generateOtp } from 'src/utils/generators/OtpGenerator';
import { OtpMailService } from 'src/common/notifications/OtpNotification';

@Injectable()
export class AuthService {
  constructor(
    private entityManager: EntityManager, // Inject EntityManager for raw SQL queries
    private readonly authCommonServices: AuthCommonServices,
    private readonly OtpMailService: OtpMailService,
  ) {}

  async userSignUp(
    body: SignUpDto,
  ): Promise<{ user: any; access_token: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.authCommonServices.checkUserExistByEmail(
        body.email,
      );
      if (existingUser) {
        throw new UnauthorizedException('User already exists!');
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      // Insert user into the database
      const [newUser] = await this.entityManager.query(
        `INSERT INTO "User" (email, password, role) VALUES ($1, $2, $3) RETURNING *`,
        [body.email, hashedPassword, body.role || UserRole.ATTENDEE],
      );

      // Generate access token
      const accessToken = await this.authCommonServices.generateJwtToke({
        email: newUser.email,
        id: newUser.id,
        role: newUser.role,
        password: newUser.password,
      });

      return { user: newUser, access_token: accessToken };
    } catch (error) {
      // Re-throw known NestJS exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async userLogin(body: LoginDto): Promise<{ access_token: string }> {
    try {
      const existingUser = await this.authCommonServices.checkUserExistByEmail(
        body.email,
      );

      if (!existingUser.email) {
        throw new UnauthorizedException(
          'User does not exist. Please create an account to proceed.',
        );
      }

      // Compare password
      const isMatch = await bcrypt.compare(
        body.password,
        existingUser.password,
      );
      if (!isMatch) {
        throw new ConflictException('Invalid email or password');
      }
      const access_token = await this.authCommonServices.generateJwtToke({
        email: existingUser.email,
        id: existingUser.id,
        password: existingUser.password,
        role: existingUser.role,
      });

      return { access_token };
    } catch (error) {
      // Re-throw known NestJS exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async userOTPRequest(body: OtpDto): Promise<void> {
    const OTP = generateOtp();

    try {
      await this.OtpMailService.sendEmail(
        body.email,
        'Eventra Verification OTP',
        OTP,
      );

      await this.entityManager.query(
        'INSERT INTO "otp_validation" (email, otp) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp RETURNING *',
        [body.email, OTP],
      );
    } catch (error) {
      // Re-throw known NestJS exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async userPasswordChange(body: PasswordChangeDto): Promise<void> {
    try {
      // Fetch the OTP from the database
      const sendOtpData = await this.entityManager.query(
        'SELECT otp FROM "otp_validation" WHERE email = $1',
        [body.email],
      );

      if (!sendOtpData.length) {
        throw new ConflictException(
          'OTP expired or not found. Please request a new OTP.',
        );
      }

      if (sendOtpData[0].otp !== body.otp) {
        throw new UnauthorizedException(
          'Invalid OTP. Please check and try again.',
        );
      }

      // Hash the password before updating the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      // Update the user password
      await this.entityManager.query(
        'UPDATE "User" SET password = $2 WHERE email = $1',
        [body.email, hashedPassword],
      );
    } catch (error) {
      throw error;
    }
  }
}
