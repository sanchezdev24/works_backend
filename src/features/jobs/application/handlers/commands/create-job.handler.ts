import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateJobCommand } from '../../commands/create-job.command';
import { JobRepository } from '../../../domain/repositories/job.repository';
import { Job } from '../../../domain/entities/job.entity';
import { JobType } from '../../../domain/value-objects/job-type.value-object';
import { ExperienceLevel } from '../../../domain/value-objects/experience-level.value-object';
import { SalaryRange } from '../../../domain/value-objects/salary-range.value-object';

@CommandHandler(CreateJobCommand)
export class CreateJobHandler implements ICommandHandler<CreateJobCommand, Job> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    // Instantiate Value Objects — validation happens inside them
    const jobType = new JobType(command.jobType);
    const experienceLevel = new ExperienceLevel(command.experienceLevel);
    const salaryRange = new SalaryRange(
      command.salaryMin ?? null,
      command.salaryMax ?? null,
      command.salaryCurrency ?? 'USD',
    );

    // Create the Domain Entity (starts as DRAFT)
    const job = Job.create({
      title: command.title,
      company: command.company,
      companyLogoUrl: command.companyLogoUrl,
      location: command.location,
      isRemote: command.isRemote,
      jobType,
      experienceLevel,
      salaryRange,
      description: command.description,
      requirements: command.requirements,
      benefits: command.benefits,
      tags: command.tags ?? [],
      applyUrl: command.applyUrl,
      expiresAt: command.expiresAt,
    });

    // Business rule: publish immediately if requested
    if (command.publishImmediately) {
      job.publish();
    }

    return this.jobRepository.save(job);
  }
}
