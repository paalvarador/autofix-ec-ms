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

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
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
    console.log(`userToken: ${userToken?.token}`);

    if (!userToken) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found or invalid credentials',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return res.status(200).json({ message: 'Login successfull' });
  }

  @Get('me')
  me(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['authToken'];

    console.log(`valor del token es igual a: ${token}`);

    console.log(`Por que llamo al me despues de loguearme`);

    console.log(`token: ${token}`);

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const userData = this.authService.decodeToken(token);
      return res.status(200).json(userData);
    } catch (err) {
      console.log('Invalid or expired token', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authToken');

    return res.status(200).json({
      message: 'Logout successfull',
    });
  }
}
