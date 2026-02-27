import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityNotFoundException } from '@core/domain/exceptions/domain.exception';
import { GetJobByIdQuery } from '../../queries/get-job-by-id.query';
import { JobRepository } from '../../../domain/repositories/job.repository';
import { Job } from '../../../domain/entities/job.entity';

@QueryHandler(GetJobByIdQuery)
export class GetJobByIdHandler implements IQueryHandler<GetJobByIdQuery, Job> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(query: GetJobByIdQuery): Promise<Job> {
    const job = await this.jobRepository.findById(query.id);

    if (!job) {
      throw new EntityNotFoundException('Job', query.id);
    }

    return job;
  }
}
