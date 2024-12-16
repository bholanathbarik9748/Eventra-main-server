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
      // Use a JOIN to fetch data from User and profile tables in one query
      const [result] = await this.entityManager.query(
        `
      SELECT *
      FROM "User" u
      LEFT JOIN "profile" p ON p.userid = u.id
      WHERE u.email = $1 AND p.is_active = $2
      `,
        [email, true],
      );

      // If no user is found, return default object
      if (!result.is_active) {
        return {
          email: '',
          id: '',
          password: '',
          role: '',
        };
      }

      const data: UserExist = {
        email: result.email,
        id: result.userid,
        password: result.password,
        role: result.role,
      };

      return data;
    } catch (error) {
      console.error('Error in checkUserExistByEmail:', error);
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
