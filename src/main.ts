import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3000;


  try {
    await app.listen(PORT);
    Logger.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Error starting server:', error.message);
    console.error('Stack trace:', error.stack || 'No stack available');
  }
}

bootstrap();
