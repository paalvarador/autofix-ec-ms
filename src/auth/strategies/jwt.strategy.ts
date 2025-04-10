import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  validate(payload: { id: string; email: string; role: string }) {
    console.log(`payload.id: ${payload.id}`);
    console.log(`payload.email: ${payload.email}`);
    console.log(`payload.role: ${payload.role}`);

    return {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
