import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenService } from '../services/refresh-token.service';

@Injectable()
export class TokenCleanupTask {
  private readonly logger = new Logger(TokenCleanupTask.name);

  constructor(private refreshTokenService: RefreshTokenService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleTokenCleanup() {
    this.logger.log('Iniciando limpieza de tokens expirados...');
    
    try {
      await this.refreshTokenService.cleanupExpiredTokens();
      this.logger.log('Limpieza de tokens completada exitosamente');
    } catch (error) {
      this.logger.error('Error durante la limpieza de tokens:', error);
    }
  }

  // Método manual para testing
  async manualCleanup() {
    this.logger.log('Limpieza manual de tokens iniciada...');
    await this.refreshTokenService.cleanupExpiredTokens();
  }
}