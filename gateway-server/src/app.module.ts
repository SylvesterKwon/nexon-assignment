import { Module } from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import serviceUrlConfig from './config/service-url.config';
import authConfig from './config/auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EventApiController } from './event-api.controller';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [authConfig, serviceUrlConfig],
      isGlobal: true,
    }),
  ],
  providers: [JwtStrategy],
  controllers: [AuthApiController, EventApiController],
})
export class AppModule {}
