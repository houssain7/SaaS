import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 👇 Swagger imports
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('SaaS API')
    .setDescription('API documentation for SaaS platform')
    .setVersion('1.0')
    .addBearerAuth() // for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  // http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();