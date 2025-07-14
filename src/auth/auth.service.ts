import { Injectable, ConflictException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto, TokenResponseDto } from './dto/refresh-token.dto';
import { EmailService } from './services/email.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, Request } from 'express';
import * as process from 'node:process';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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
    private emailService: EmailService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async loginUser(user: LoginDto, response: Response, request?: Request): Promise<TokenResponseDto | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!foundUser) return null;

    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordValid) return null;

    // Generar access token (corto plazo)
    const accessToken = this.jwtService.sign({
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      role: foundUser.role,
    });

    // Extraer información del request para el refresh token
    const deviceId = request?.headers['x-device-id'] as string;
    const userAgent = request?.headers['user-agent'];
    const ipAddress = request?.ip || request?.connection?.remoteAddress;

    // Generar refresh token (largo plazo)
    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      foundUser.id,
      deviceId,
      userAgent,
      ipAddress
    );

    // Configurar cookies
    response.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000, // 1 hora para access token
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600 * 1000, // 30 días para refresh token
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hora en segundos
      tokenType: 'Bearer',
    };
  }

  async registerUser(userData: RegisterDto, response: Response, request?: Request): Promise<any> {
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

    // Generar access token
    const accessToken = this.jwtService.sign({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    });

    // Extraer información del request
    const deviceId = request?.headers['x-device-id'] as string;
    const userAgent = request?.headers['user-agent'];
    const ipAddress = request?.ip || request?.connection?.remoteAddress;

    // Generar refresh token
    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      newUser.id,
      deviceId,
      userAgent,
      ipAddress
    );

    // Configurar cookies
    response.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000, // 1 hora
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600 * 1000, // 30 días
    });

    return {
      user: newUser,
      accessToken,
      refreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  }

  async refreshAccessToken(refreshTokenDto: RefreshTokenDto, request?: Request): Promise<TokenResponseDto> {
    const { refreshToken: token, deviceId } = refreshTokenDto;

    // Validar el refresh token
    const { userId } = await this.refreshTokenService.validateRefreshToken(token);

    // Obtener información del usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Generar nuevo access token
    const accessToken = this.jwtService.sign({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });

    // Rotar refresh token (generar uno nuevo y revocar el anterior)
    const userAgent = request?.headers['user-agent'];
    const ipAddress = request?.ip || request?.connection?.remoteAddress;
    
    const newRefreshToken = await this.refreshTokenService.rotateRefreshToken(
      token,
      deviceId,
      userAgent,
      ipAddress
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600, // 1 hora
      tokenType: 'Bearer',
    };
  }

  async logout(refreshToken?: string, userId?: string): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
    } else if (userId) {
      await this.refreshTokenService.revokeAllUserTokens(userId);
    }
  }

  async logoutFromAllDevices(userId: string): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }

  async logoutFromDevice(userId: string, deviceId: string): Promise<void> {
    await this.refreshTokenService.revokeTokensByDevice(userId, deviceId);
  }

  async getUserActiveSessions(userId: string): Promise<any[]> {
    return this.refreshTokenService.getUserActiveSessions(userId);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Buscar el usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return {
        message: 'Si el email existe en nuestro sistema, recibirás un enlace de reset de contraseña.',
      };
    }

    // Generar token de reset único y seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Expira en 1 hora

    // Guardar el token en la base de datos
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    // Enviar email con el token
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'Si el email existe en nuestro sistema, recibirás un enlace de reset de contraseña.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // Buscar usuario por token y verificar que no haya expirado
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token de reset inválido o expirado');
    }

    // Hash de la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña y limpiar tokens de reset
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Enviar email de confirmación
    await this.emailService.sendPasswordChangeConfirmation(user.email);

    return {
      message: 'Contraseña actualizada exitosamente',
    };
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
