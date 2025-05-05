import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async loginUser(user: LoginDto, response: Response) {
    const userToken = await this.validateUser(user);
    if (!userToken) return null;

    response.cookie('Authentication', userToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 3600 * 60 * 60 * 1000),
    });
    return userToken;
  }

  async validateUser(user: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!foundUser) return null;

    if (foundUser.password === user.password) {
      return this.jwtService.sign({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      });
    }
  }
}
