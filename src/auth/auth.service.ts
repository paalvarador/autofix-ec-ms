import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import * as process from 'node:process';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
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
    console.log(`userToken: ${userToken}`);
    if (!userToken) return null;

    response.cookie('authToken', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo usa secure en Producción
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000 * 24,
    });

    return userToken;
  }

  async validateUser(user: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    console.log(`foundUser: ${JSON.stringify(foundUser)}`);

    if (!foundUser) return null;

    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    console.log(`isPasswordValid: ${isPasswordValid}`);
    if (!isPasswordValid) return null;

    return this.jwtService.sign({
      id: foundUser.id,
      firstName: foundUser.firstName.split(' ')[0],
      lastName: foundUser.lastName.split(' ')[0],
      email: foundUser.email,
      role: foundUser.role,
    });
  }

  decodeToken(token: string): {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    exp: number;
  } {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    return {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      email: decoded.email,
      exp: decoded.exp,
    };
  }
}
