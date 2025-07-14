import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateRefreshToken(
    userId: string, 
    deviceId?: string, 
    userAgent?: string, 
    ipAddress?: string
  ): Promise<string> {
    // Generar token único
    const token = crypto.randomBytes(64).toString('hex');
    
    // Calcular fecha de expiración (30 días)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Guardar en base de datos
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
        deviceId,
        userAgent,
        ipAddress,
      },
    });

    this.logger.log(`Refresh token generado para usuario: ${userId}`);
    return token;
  }

  async validateRefreshToken(token: string): Promise<{ userId: string; tokenId: string }> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    if (refreshToken.expiresAt < new Date()) {
      // Token expirado, eliminarlo
      await this.prisma.refreshToken.delete({
        where: { id: refreshToken.id },
      });
      throw new UnauthorizedException('Refresh token expirado');
    }

    return {
      userId: refreshToken.userId,
      tokenId: refreshToken.id,
    };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });

    this.logger.log(`Refresh token revocado: ${token.substring(0, 10)}...`);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { 
        userId,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    this.logger.log(`Todos los refresh tokens revocados para usuario: ${userId}`);
  }

  async revokeTokensByDevice(userId: string, deviceId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { 
        userId,
        deviceId,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    this.logger.log(`Refresh tokens revocados para dispositivo: ${deviceId} del usuario: ${userId}`);
  }

  async cleanupExpiredTokens(): Promise<void> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    this.logger.log(`${result.count} refresh tokens expirados eliminados`);
  }

  async getUserActiveSessions(userId: string): Promise<any[]> {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        deviceId: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async rotateRefreshToken(
    oldToken: string,
    deviceId?: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<string> {
    // Validar el token actual
    const { userId } = await this.validateRefreshToken(oldToken);

    // Revocar el token actual
    await this.revokeRefreshToken(oldToken);

    // Generar un nuevo token
    return this.generateRefreshToken(userId, deviceId, userAgent, ipAddress);
  }
}