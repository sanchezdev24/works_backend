import { Job } from '../../../domain/entities/job.entity';
import { JobOrmEntity } from '../orm-entities/job.orm-entity';
import { Uuid } from '@core/domain/value-objects/uuid.value-object';
import { JobType } from '../../../domain/value-objects/job-type.value-object';
import { ExperienceLevel } from '../../../domain/value-objects/experience-level.value-object';
import { SalaryRange } from '../../../domain/value-objects/salary-range.value-object';
import { JobStatus } from '../../../domain/value-objects/job-status.value-object';

/**
 * Data Mapper — translates between ORM entities and Domain entities.
 * Neither the Domain Entity nor the ORM Entity knows about each other.
 */
export class JobMapper {
  /**
   * ORM Entity → Domain Entity (reconstitution)
   */
  static toDomain(orm: JobOrmEntity): Job {
    return Job.reconstitute({
      id: new Uuid(orm.id),
      title: orm.title,
      company: orm.company,
      companyLogoUrl: orm.companyLogoUrl,
      location: orm.location,
      isRemote: orm.isRemote,
      jobType: new JobType(orm.jobType),
      experienceLevel: new ExperienceLevel(orm.experienceLevel),
      salaryRange: new SalaryRange(
        orm.salaryMin ? Number(orm.salaryMin) : null,
        orm.salaryMax ? Number(orm.salaryMax) : null,
        orm.salaryCurrency,
      ),
      description: orm.description,
      requirements: orm.requirements,
      benefits: orm.benefits,
      tags: orm.tags ?? [],
      status: new JobStatus(orm.status),
      applyUrl: orm.applyUrl,
      publishedAt: orm.publishedAt,
      expiresAt: orm.expiresAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  /**
   * Domain Entity → ORM Entity (persistence)
   */
  static toOrm(domain: Job): JobOrmEntity {
    const orm = new JobOrmEntity();
    orm.id = domain.getId().getValue();
    orm.title = domain.getTitle();
    orm.company = domain.getCompany();
    orm.companyLogoUrl = domain.getCompanyLogoUrl();
    orm.location = domain.getLocation();
    orm.isRemote = domain.getIsRemote();
    orm.jobType = domain.getJobType().getValue();
    orm.experienceLevel = domain.getExperienceLevel().getValue();
    orm.salaryMin = domain.getSalaryRange().getMin();
    orm.salaryMax = domain.getSalaryRange().getMax();
    orm.salaryCurrency = domain.getSalaryRange().getCurrency();
    orm.description = domain.getDescription();
    orm.requirements = domain.getRequirements();
    orm.benefits = domain.getBenefits();
    orm.tags = domain.getTags();
    orm.status = domain.getStatus().getValue();
    orm.applyUrl = domain.getApplyUrl();
    orm.publishedAt = domain.getPublishedAt();
    orm.expiresAt = domain.getExpiresAt();
    orm.createdAt = domain.getCreatedAt();
    orm.updatedAt = domain.getUpdatedAt();
    return orm;
  }
}
