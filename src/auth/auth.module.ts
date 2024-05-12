import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AtStratergy } from 'src/common/strategies/jwtAccessToken';
import { RtStratergy } from 'src/common/strategies/jwtRefreshToken';
import {
  GoogleStratergy,
  SessionSerializer,
} from 'src/common/strategies/googleOauth';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AtStratergy,
    RtStratergy,
    AuthService,
    GoogleStratergy,
    SessionSerializer,
  ],
})
export class AuthModule {}
