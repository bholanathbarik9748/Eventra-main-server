import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCommonServices } from '../services/auth.common.service';
import { UserRole } from 'src/module/Auth/auth.enum';

@Injectable()
export class OrganizerGuard implements CanActivate {
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
      return decodeToken.role === UserRole.ORGANIZER; // Allow access for ORGANIZER
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
