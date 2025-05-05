import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

interface JwtPayload {
  role: string;
  email: string;
  exp: number;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userToken = await this.authService.loginUser(data, res);

    console.log(`userToken: ${JSON.stringify(userToken)}`);

    if (!userToken) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found or invalid credentials',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: 'Login successfull' };
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    console.log(`req.cookies: ${JSON.stringify(req.cookies)}`);
    const token: string | undefined = await req.cookies['token'];

    console.log(`token: ${token}`);

    if (!token) return res.status(401).json({ message: 'No token' });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      return res.status(200).json({
        role: decoded.role,
        email: decoded.email,
        exp: decoded.exp,
      });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
