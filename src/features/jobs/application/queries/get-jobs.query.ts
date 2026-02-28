import { IQuery } from '@nestjs/cqrs';

export class GetJobsQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly jobType?: string,
    public readonly experienceLevel?: string,
    public readonly isRemote?: boolean,
    public readonly status?: string,
    public readonly tags?: string[],
    public readonly salaryMin?: number,
    public readonly salaryMax?: number,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
