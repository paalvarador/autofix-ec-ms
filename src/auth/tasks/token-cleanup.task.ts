import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenService } from '../services/refresh-token.service';

@Injectable()
export class TokenCleanupTask {
  private readonly logger = new Logger(TokenCleanupTask.name);

  constructor(private refreshTokenService: RefreshTokenService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleTokenCleanup() {
    this.logger.log('Starting cleanup of expired tokens...');

    try {
      await this.refreshTokenService.cleanupExpiredTokens();
      this.logger.log('Token cleanup completed successfully');
    } catch (error) {
      this.logger.error('Error during token cleanup:', error);
    }
  }

  // Manual method for testing
  async manualCleanup() {
    this.logger.log('Manual token cleanup initiated...');
    await this.refreshTokenService.cleanupExpiredTokens();
  }
}