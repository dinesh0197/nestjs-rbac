import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/jwt'; 
import { RoleGuard } from './common/guards/roles';

const AtGuards = {
  provide: APP_GUARD,
  useClass: AtGuard,
};

const RoleGuards = { 
  provide: APP_GUARD,
  useClass: RoleGuard,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ session: true }),
    MongooseModule.forRoot(getMongoUri()),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AtGuards, RoleGuards],
})
export class AppModule {}

function getMongoUri(): string {
  const configService = new ConfigService();
  console.log({ uri: configService.get<string>('DATABASE_URI') });
  return configService.get<string>('DATABASE_URI');
}
