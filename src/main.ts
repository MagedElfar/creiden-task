import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(+ process.env.PORT);

  logger.log(`app is starting in port ${process.env.port}`)
}
bootstrap();
