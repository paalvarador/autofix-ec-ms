import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
    if (!userToken) return null;

    response.cookie('authToken', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000 * 24,
    });

    return userToken;
  }

  async registerUser(userData: RegisterDto, response: Response) {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Crear el usuario
    const newUser = await this.prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        role: userData.role,
        workshopId: userData.workshopId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        workshopId: true,
        createdAt: true,
      },
    });

    // Generar token JWT
    const token = this.jwtService.sign({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    });

    // Configurar cookie
    response.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000 * 24,
    });

    return {
      user: newUser,
      token,
    };
  }

  async validateUser(user: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!foundUser) return null;

    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isPasswordValid) return null;

    return this.jwtService.sign({
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
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
