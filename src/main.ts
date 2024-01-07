import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InitializeAdmin } from './admin-init';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    // Docs: https://docs.nestjs.com/techniques/validation
    new ValidationPipe({
      skipNullProperties: true,
      whitelist: true,
    }),
  );
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Online-Judge-Server')
    .setDescription('Online Judge Server')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  await InitializeAdmin(app);

  // Initialize Swagger Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
  });

  await app.listen(3000);
}
bootstrap();
