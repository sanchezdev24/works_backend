import { PaginatedResult, Pagination } from '@core/domain/value-objects/pagination.value-object';
import { Job } from '../entities/job.entity';

export interface JobFilters {
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  status?: string;
  tags?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

/**
 * Abstract repository — belongs to the Domain layer.
 * Infrastructure implements this contract.
 */
export abstract class JobRepository {
  abstract findById(id: string): Promise<Job | null>;
  abstract findAll(filters: JobFilters, pagination: Pagination): Promise<PaginatedResult<Job>>;
  abstract save(job: Job): Promise<Job>;
  abstract update(job: Job): Promise<Job>;
  abstract delete(id: string): Promise<void>;
  abstract existsById(id: string): Promise<boolean>;
  abstract countActive(): Promise<number>;
}
