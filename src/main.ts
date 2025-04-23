import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import missing Swagger modules

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transforms payloads to DTOs
    forbidNonWhitelisted: true, // Reject values that aren't in the DTO
    whitelist: true, // Automatically strips properties that are not in the DTO
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Hospital Management API')
    .setDescription('API documentation for the hospital management system')
    .setVersion('1.0')
    .addBearerAuth() // If you want to secure endpoints with Bearer JWT tokens
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  // Start the application on port 3000
  await app.listen(3000);
}

bootstrap();
