import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  buildPaginatedResult,
  Pagination,
  PaginatedResult,
} from '@core/domain/value-objects/pagination.value-object';
import { Job } from '../../../domain/entities/job.entity';
import { JobRepository, JobFilters } from '../../../domain/repositories/job.repository';
import { JobOrmEntity } from '../orm-entities/job.orm-entity';
import { JobMapper } from '../mappers/job.mapper';
// ✅ FIX: importar el enum en lugar de usar 'active' as any
import { JobStatusEnum } from '../../../domain/value-objects/job-status.value-object';

/**
 * Infrastructure implementation of the domain's JobRepository contract.
 * Uses TypeORM + PostgreSQL.
 */
@Injectable()
export class TypeOrmJobRepository implements JobRepository {
  constructor(
    @InjectRepository(JobOrmEntity)
    private readonly ormRepo: Repository<JobOrmEntity>,
  ) {}

  async findById(id: string): Promise<Job | null> {
    const orm = await this.ormRepo.findOne({ where: { id } });
    return orm ? JobMapper.toDomain(orm) : null;
  }

  async findAll(filters: JobFilters, pagination: Pagination): Promise<PaginatedResult<Job>> {
    const qb = this.ormRepo
      .createQueryBuilder('job')
      .orderBy('job.publishedAt', 'DESC')
      .addOrderBy('job.createdAt', 'DESC');

    this.applyFilters(qb, filters);

    const total = await qb.getCount();

    const ormEntities = await qb
      .skip(pagination.getOffset())
      .take(pagination.getLimit())
      .getMany();

    const jobs = ormEntities.map(JobMapper.toDomain);

    return buildPaginatedResult(jobs, total, pagination);
  }

  async save(job: Job): Promise<Job> {
    const orm = JobMapper.toOrm(job);
    const saved = await this.ormRepo.save(orm);
    return JobMapper.toDomain(saved);
  }

  async update(job: Job): Promise<Job> {
    const orm = JobMapper.toOrm(job);
    await this.ormRepo.update({ id: orm.id }, orm);
    return job;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  async countActive(): Promise<number> {
    // ✅ FIX: usar JobStatusEnum.ACTIVE en lugar de 'active' as any
    return this.ormRepo.count({ where: { status: JobStatusEnum.ACTIVE } });
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private applyFilters(qb: SelectQueryBuilder<JobOrmEntity>, filters: JobFilters): void {
    if (filters.status) {
      qb.andWhere('job.status = :status', { status: filters.status });
    }

    if (filters.jobType) {
      qb.andWhere('job.jobType = :jobType', { jobType: filters.jobType });
    }

    if (filters.experienceLevel) {
      qb.andWhere('job.experienceLevel = :experienceLevel', {
        experienceLevel: filters.experienceLevel,
      });
    }

    if (filters.isRemote !== undefined) {
      qb.andWhere('job.isRemote = :isRemote', { isRemote: filters.isRemote });
    }

    if (filters.salaryMin !== undefined) {
      qb.andWhere('job.salaryMin >= :salaryMin', { salaryMin: filters.salaryMin });
    }

    if (filters.salaryMax !== undefined) {
      qb.andWhere('job.salaryMax <= :salaryMax', { salaryMax: filters.salaryMax });
    }

    if (filters.tags && filters.tags.length > 0) {
      // PostgreSQL array overlap operator &&
      qb.andWhere('job.tags && :tags', { tags: filters.tags });
    }

    if (filters.search) {
      qb.andWhere(
        `to_tsvector('english', job.title || ' ' || job.company || ' ' || job.description) 
         @@ plainto_tsquery('english', :search)`,
        { search: filters.search },
      );
    }
  }
}