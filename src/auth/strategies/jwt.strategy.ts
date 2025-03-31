import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
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
