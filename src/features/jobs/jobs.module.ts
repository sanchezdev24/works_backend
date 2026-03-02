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
 * ✅ FIX: NODE_ENV evaluado a nivel de módulo se ejecuta ANTES de que
 * ConfigModule cargue el .env, por lo que siempre era undefined/false.
 *
 * Solución: NODE_ENV debe venir del sistema operativo / script de arranque,
 * no del archivo .env. Ver package.json:
 *   "start:dev": "NODE_ENV=development nest start --watch"
 *
 * Como el .env.development ya tiene NODE_ENV=development, el check aquí
 * funciona correctamente SOLO si el script lo inyecta antes de que Node arranque.
 *
 * Para mayor robustez, SeedJobsHandler siempre se registra como provider
 * (es necesario para que el CommandBus lo encuentre en desarrollo),
 * y el controlador seeder se registra siempre pero está protegido
 * por el guard interno de JobsSeederController que valida NODE_ENV en runtime.
 */
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([JobOrmEntity]),
  ],
  controllers: [
    JobsController,
    // ✅ Siempre registrado: el guard interno de JobsSeederController
    // bloquea cualquier request si NODE_ENV !== 'development' en runtime.
    // Esto evita el problema de evaluar process.env antes del bootstrap.
    JobsSeederController,
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