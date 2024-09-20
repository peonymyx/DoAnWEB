import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Server running on ${process.env.PROTOCAL}${process.env.HOST}:${process.env.PORT}`);
  await app.listen(3000);
}
bootstrap();
