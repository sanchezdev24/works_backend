import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './core/infrastructure/database/database.config';
import { JobsModule } from './features/jobs/jobs.module';

@Module({
  imports: [
    // ─── Config ──────────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.development', '.env'],
    }),

    // ─── Database ─────────────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    // ─── Features ─────────────────────────────────────────────────────────────────
    JobsModule,
  ],
})
export class AppModule {}
