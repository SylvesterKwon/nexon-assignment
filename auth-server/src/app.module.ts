import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoDbConfig from './configs/mongo-db.config';
import authConfig from './configs/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongoDbConfig, authConfig],
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
    UserModule,
  ],
})
export class AppModule {}
