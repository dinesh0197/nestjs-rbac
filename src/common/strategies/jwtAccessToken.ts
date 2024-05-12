import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
// Access Token Strategy
export class AtStratergy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AT_SECRET_KEY'),
      // passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload) {
     return payload;
  }
}

type JwtPayload = {
  userId: string;
  email: string;
  role: string
};
