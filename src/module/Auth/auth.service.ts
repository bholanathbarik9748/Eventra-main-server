import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto, signUpDto } from './auth.dto';
import { EntityManager } from 'typeorm';
import { UserRole } from './auth.enum';
import * as bcrypt from 'bcrypt';
import { AuthCommonServices } from 'src/common/services/auth.common.service';
import { globalDtoHandler } from 'src/common/validation/dtoHandler.validation';

@Injectable()
export class AuthService {
  constructor(
    private entityManager: EntityManager, // Inject EntityManager for raw SQL queries
    private readonly AuthCommonServices: AuthCommonServices,
  ) {}

  async userSignUp(req: Request, res: Response): Promise<Response> {
    const body = req.body;

    // Transform body into an instance of AuthDto and validate it
    const AuthDto = await globalDtoHandler(signUpDto, body, res);
    if (AuthDto) {
      return AuthDto;
    }

    try {
      const existingUser = await this.AuthCommonServices.checkUserExistByEmail(
        body.email,
      );

      if (existingUser.email) {
        return res.status(409).json({
          status: 'error',
          message: 'User Already Exist !',
        });
      }

      // 2. Hash the password before inserting into DB
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      const response = await this.entityManager.query(
        'INSERT INTO "User" (email,password,role) VALUES ($1, $2, $3) RETURNING *',
        [body?.email, hashedPassword, body?.role || UserRole.ATTENDEE],
      );

      const access_token = await this.AuthCommonServices.generateJwtToke({
        email: body?.email,
        id: response[0].id,
        password: hashedPassword,
        role: body?.role,
      });

      return res.status(200).json({
        status: 'success',
        message: 'User created successfully',
        user: response[0],
        access_token,
      });
    } catch (error) {
      console.error('Sing Up error ---> ', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error, please try again later.',
      });
    }
  }

  async userLogin(req: Request, res: Response): Promise<Response> {
    const body = req.body;

    // Transform body into an instance of AuthDto and validate it
    const AuthDto = await globalDtoHandler(LoginDto, body, res);
    if (AuthDto) {
      return AuthDto;
    }

    try {
      const existingUser = await this.AuthCommonServices.checkUserExistByEmail(
        body.email,
      );

      if (!existingUser.email) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist. Please create an account to proceed.',
        });
      }

      const access_token = await this.AuthCommonServices.generateJwtToke({
        email: existingUser.email,
        id: existingUser.id,
        password: existingUser.password,
        role: existingUser.role,
      });

      return res.status(200).json({
        status: 'success',
        message: 'User Login successfully',
        user: existingUser,
        access_token,
      });
    } catch (error) {
      console.error('Login error', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error, please try again later.',
      });
    }
  }
}
