import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './services/email.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { TokenCleanupTask } from './tasks/token-cleanup.task';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') || '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, RefreshTokenService, TokenCleanupTask, JwtStrategy],
})
export class AuthModule {}
