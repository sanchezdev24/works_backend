import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination, PaginatedResult } from '@core/domain/value-objects/pagination.value-object';
import { GetJobsQuery } from '../../queries/get-jobs.query';
import { JobRepository } from '../../../domain/repositories/job.repository';
import { Job } from '../../../domain/entities/job.entity';

@QueryHandler(GetJobsQuery)
export class GetJobsHandler implements IQueryHandler<GetJobsQuery, PaginatedResult<Job>> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(query: GetJobsQuery): Promise<PaginatedResult<Job>> {
    const pagination = new Pagination(query.page, query.limit);

    const filters = {
      search: query.search,
      jobType: query.jobType,
      experienceLevel: query.experienceLevel,
      isRemote: query.isRemote,
      status: query.status ?? 'active', // default: only active jobs
      tags: query.tags,
      salaryMin: query.salaryMin,
      salaryMax: query.salaryMax,
    };

    return this.jobRepository.findAll(filters, pagination);
  }
}
