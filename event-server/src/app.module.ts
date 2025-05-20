import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import mongoDbConfig from './config/mongo-db.config';
import serviceUrlConfig from './config/service-url.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongoDbConfig, serviceUrlConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoDbUri = configService.get<string>('mongoDb.uri');
        return {
          uri: mongoDbUri,
        };
      },
    }),
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
