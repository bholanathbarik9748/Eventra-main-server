import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

async function mainApp() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable CORS globally
  app.enableCors({
    origin: '*', // Adjust this to allow specific domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(4000);
}

mainApp();
