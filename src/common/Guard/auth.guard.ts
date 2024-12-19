import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCommonServices } from '../services/Auth.common.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authCommonServices: AuthCommonServices,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Extract the token from headers
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException(['No authorization token provided']);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(['Invalid authorization token']);
    }

    try {
      // Verify token using JwtService
      const decodeToken = await this.authCommonServices.validateJwtToken(token);
      const userData = await this.authCommonServices.checkUserExistByEmail(
        decodeToken.email,
      );

      if (!userData.email) {
        throw new UnauthorizedException(['Token expired, please Login again']);
      }
      return true; // Allow access
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
