import { registerAs } from '@nestjs/config';

export default registerAs('serviceUrl', () => ({
  authApi: process.env.AUTH_API_URL,
  eventApi: process.env.EVENT_API_URL,

  // ... 다른 microservice가 추가된다면 여기에 추가 필요
}));
