import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserExist } from '../Types/auth.common.Type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthCommonServices {
  constructor(
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async checkUserExistByEmail(email: string): Promise<UserExist> {
    try {
      const response = await this.entityManager.query(
        'select * FROM "User" WHERE email = $1',
        [email],
      );

      // If no user is found, return null
      if (!response || response.length === 0) {
        return {
          email: '',
          id: '',
          password: '',
          role: '',
        };
      }

      const data: UserExist = {
        email: response[0].email,
        id: response[0].id,
        password: response[0].password,
        role: response[0].role,
      };
      return data;
    } catch (error) {
      console.error('Error Auth Common Services ---> ', error);
      return {
        email: '',
        id: '',
        password: '',
        role: '',
      };
    }
  }

  async generateJwtToke(user: UserExist): Promise<string> {
    try {
      const payload = {
        sub: user.id, // 'sub' is the subject of the token (typically user ID)
        email: user.email, // Include user email
        role: user.role, // Include user role for authorization checks
      };

      // Generate the token with the payload
      const token = this.jwtService.sign(payload, { expiresIn: '30d' });
      return token;
    } catch (error) {
      console.error('Error Token --->', error);
      return '';
    }
  }

  async validateJwtToken(token: string): Promise<any> {
    try {
      const decode = this.jwtService.decode(token);
      return decode;
    } catch (error) {
      console.error('Error Validate Token --->', error);
      return false;
    }
  }
}
