import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './features/jobs/infrastructure/http/filters/domain-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ─── Global Prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ─── Validation ─────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global Exception Filters ───────────────────────────────────────────────
  app.useGlobalFilters(new DomainExceptionFilter());

  // ─── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ─── Swagger (only in development) ──────────────────────────────────────────
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('NestJS Jobs API')
      .setDescription(
        `Clean Architecture + CQRS + DDD + PostgreSQL\n\n` +
        `**Dev endpoints** (only available in development):\n` +
        `- \`POST /api/v1/dev/seed/jobs?count=20\` — Seeds sample jobs\n` +
        `- \`DELETE /api/v1/dev/reset/jobs\` — Clears all jobs`,
      )
      .setVersion('1.0.0')
      .addTag('Jobs', 'Job listings endpoints')
      .addTag('🛠 Dev Tools (development only)', 'Seeder and reset endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log(`📚 Swagger docs: http://localhost:${process.env.APP_PORT || 3000}/api/docs`);
  }

  // ─── Start ──────────────────────────────────────────────────────────────────
  const port = parseInt(process.env.APP_PORT || '3000', 10);
  await app.listen(port);

  logger.log(`🚀 App running at: http://localhost:${port}/api/v1`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV}`);

  if (isDev) {
    logger.log(`🌱 Seed endpoint: POST http://localhost:${port}/api/v1/dev/seed/jobs?count=20`);
  }
}

bootstrap();
