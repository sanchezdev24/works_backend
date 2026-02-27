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

const isDevEnvironment = process.env.NODE_ENV === 'development';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([JobOrmEntity]),
  ],
  controllers: [
    JobsController,
    // ✅ Seeder controller only registered in development
    ...(isDevEnvironment ? [JobsSeederController] : []),
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
