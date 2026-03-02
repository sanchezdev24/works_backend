import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entity
import { JobOrmEntity } from './infrastructure/persistence/orm-entities/job.orm-entity';

// Repository binding
import { JobRepository } from './domain/repositories/job.repository';
import { TypeOrmJobRepository } from './infrastructure/persistence/repositories/typeorm-job.repository';

// Query Handlers
import { GetJobsHandler } from './application/handlers/queries/get-jobs.handler';
import { GetJobByIdHandler } from './application/handlers/queries/get-job-by-id.handler';

// Command Handlers
import { CreateJobHandler } from './application/handlers/commands/create-job.handler';
import { SeedJobsHandler } from './application/handlers/commands/seed-jobs.handler';

// Controllers
import { JobsController } from './infrastructure/http/controllers/jobs.controller';
import { JobsSeederController } from './infrastructure/http/controllers/jobs-seeder.controller';

const QueryHandlers = [GetJobsHandler, GetJobByIdHandler];
const CommandHandlers = [CreateJobHandler, SeedJobsHandler];

/**
 * ✅ FIX: JobsSeederController siempre se registra.
 * La protección se hace en runtime con guardDev() dentro de cada endpoint.
 *
 * Razón: process.env.NODE_ENV leído a nivel de módulo puede evaluarse
 * antes de que el entorno esté completamente cargado. Además, lanzar
 * excepciones en el constructor de un controlador crashea el proceso
 * completo de NestJS (no se puede recuperar en el arranque).
 */
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([JobOrmEntity]),
  ],
  controllers: [
    JobsController,
    JobsSeederController, // protegido por guardDev() en cada método
  ],
  providers: [
    // CQRS handlers
    ...QueryHandlers,
    ...CommandHandlers,

    // Repository binding: Domain interface → Infrastructure implementation
    {
      provide: JobRepository,
      useClass: TypeOrmJobRepository,
    },
  ],
  exports: [JobRepository],
})
export class JobsModule {}