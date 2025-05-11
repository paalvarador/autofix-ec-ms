import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import * as process from 'node:process';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  role: string;
  email: string;
  exp: number;
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

    response.cookie('authToken', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo usa secure en Producción
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000 * 24,
    });

    return { success: true, token: userToken };
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

  decodeToken(token: string): { role: string; email: string; exp: number } {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    return {
      role: decoded.role,
      email: decoded.email,
      exp: decoded.exp,
    };
  }
}
