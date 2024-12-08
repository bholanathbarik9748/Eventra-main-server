import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('/login')
  userLogin(@Req() req: Request, @Res() res: Response): any {
    return this.userService.userLogin(req, res);
  }

  @Post('/sign-up')
  userSignUp(@Req() req: Request, @Res() res: Response): any {
    return this.userService.userSignUp(req, res);
  }
}
