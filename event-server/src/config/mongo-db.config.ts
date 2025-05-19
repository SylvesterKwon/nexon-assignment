import { registerAs } from '@nestjs/config';

export default registerAs('mongoDb', () => ({
  uri: process.env.MONGO_URI,
}));
