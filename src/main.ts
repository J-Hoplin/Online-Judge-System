import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InitializeAdmin } from './admin-init';
import { AppModule } from './app.module';
import { SentryFilter } from './filter';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get Express http adapter
  const { httpAdapter } = app.get(HttpAdapterHost);

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
    .setContact(
      'J-Hoplin',
      'https://github.com/J-Hoplin',
      'hoplin.dev@gmail.com',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  await InitializeAdmin(app);

  // Initialize Swagger Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
  });

  // Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
