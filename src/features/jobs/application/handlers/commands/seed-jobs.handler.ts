import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SeedJobsCommand } from '../../commands/seed-jobs.command';
import { JobRepository } from '../../../domain/repositories/job.repository';
import { Job } from '../../../domain/entities/job.entity';
import { JobType, JobTypeEnum } from '../../../domain/value-objects/job-type.value-object';
import { ExperienceLevel, ExperienceLevelEnum } from '../../../domain/value-objects/experience-level.value-object';
import { SalaryRange } from '../../../domain/value-objects/salary-range.value-object';
import { JobStatusEnum } from '../../../domain/value-objects/job-status.value-object';

interface SeedJobData {
  title: string;
  company: string;
  location: string;
  jobType: JobTypeEnum;
  experienceLevel: ExperienceLevelEnum;
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  isRemote: boolean;
}

@CommandHandler(SeedJobsCommand)
export class SeedJobsHandler implements ICommandHandler<SeedJobsCommand> {
  private readonly seedData: SeedJobData[] = [
    { title: 'Senior Flutter Developer', company: 'TechMX', location: 'Remote / Mexico City', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.SENIOR, salaryMin: 80000, salaryMax: 120000, tags: ['flutter', 'dart', 'mobile', 'ios', 'android'], isRemote: true },
    { title: 'NestJS Backend Engineer', company: 'Fintech Labs', location: 'Guadalajara, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 60000, salaryMax: 90000, tags: ['nestjs', 'typescript', 'postgresql', 'nodejs'], isRemote: true },
    { title: 'React Native Developer', company: 'Startup Hub', location: 'Mexico City, MX', jobType: JobTypeEnum.CONTRACT, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 50000, salaryMax: 80000, tags: ['react-native', 'javascript', 'mobile'], isRemote: false },
    { title: 'iOS Developer (Swift)', company: 'Citi Banamex', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.SENIOR, salaryMin: 90000, salaryMax: 130000, tags: ['swift', 'ios', 'xcode', 'objc'], isRemote: false },
    { title: 'Android Developer (Kotlin)', company: 'Tiendas 3B', location: 'Monterrey, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 65000, salaryMax: 95000, tags: ['kotlin', 'android', 'java', 'mvvm'], isRemote: true },
    { title: 'DevOps Engineer', company: 'CloudMX', location: 'Remote', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.SENIOR, salaryMin: 100000, salaryMax: 150000, tags: ['aws', 'docker', 'kubernetes', 'terraform', 'ci-cd'], isRemote: true },
    { title: 'Full Stack TypeScript Developer', company: 'AgileThought', location: 'Remote / Guadalajara', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 70000, salaryMax: 100000, tags: ['typescript', 'react', 'nestjs', 'postgresql'], isRemote: true },
    { title: 'Junior Flutter Developer', company: 'Mi Stori', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.JUNIOR, salaryMin: 35000, salaryMax: 55000, tags: ['flutter', 'dart', 'mobile'], isRemote: false },
    { title: 'Staff Engineer', company: 'Rappi', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.LEAD, salaryMin: 150000, salaryMax: 200000, tags: ['architecture', 'leadership', 'system-design'], isRemote: true },
    { title: 'Data Engineer', company: 'Grupo Salinas', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 70000, salaryMax: 110000, tags: ['python', 'spark', 'airflow', 'sql', 'bigquery'], isRemote: false },
    { title: 'Security Engineer', company: 'BBVA', location: 'Guadalajara, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.SENIOR, salaryMin: 120000, salaryMax: 160000, tags: ['cybersecurity', 'pentest', 'owasp', 'threat-modeling'], isRemote: false },
    { title: 'UX/UI Designer + Dev', company: 'El Palacio de Hierro', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 55000, salaryMax: 80000, tags: ['figma', 'design-system', 'ux', 'css'], isRemote: false },
    { title: 'Cloud Architect', company: 'OXXO Digital', location: 'Monterrey, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.LEAD, salaryMin: 140000, salaryMax: 190000, tags: ['aws', 'gcp', 'azure', 'microservices'], isRemote: true },
    { title: 'QA Automation Engineer', company: 'Kueski', location: 'Remote', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 55000, salaryMax: 85000, tags: ['selenium', 'cypress', 'playwright', 'testing'], isRemote: true },
    { title: 'Blockchain Developer', company: 'Bitso', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.SENIOR, salaryMin: 120000, salaryMax: 170000, tags: ['solidity', 'ethereum', 'web3', 'defi'], isRemote: true },
    { title: 'Machine Learning Engineer', company: 'Clip', location: 'Mexico City, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.SENIOR, salaryMin: 110000, salaryMax: 160000, tags: ['python', 'tensorflow', 'pytorch', 'mlops'], isRemote: true },
    { title: 'Backend Go Developer', company: 'Konfio', location: 'Remote', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 75000, salaryMax: 110000, tags: ['golang', 'grpc', 'microservices', 'kafka'], isRemote: true },
    { title: 'Laravel PHP Developer', company: 'Softtek', location: 'Monterrey, MX', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 50000, salaryMax: 75000, tags: ['php', 'laravel', 'mysql', 'rest-api'], isRemote: false },
    { title: 'Tech Lead Mobile', company: 'Nu Bank Mexico', location: 'Remote', jobType: JobTypeEnum.FULL_TIME, experienceLevel: ExperienceLevelEnum.LEAD, salaryMin: 160000, salaryMax: 220000, tags: ['flutter', 'kotlin', 'swift', 'architecture', 'leadership'], isRemote: true },
    { title: 'Ionic Angular Developer', company: 'Softlayer MX', location: 'Guadalajara, MX', jobType: JobTypeEnum.CONTRACT, experienceLevel: ExperienceLevelEnum.MID, salaryMin: 45000, salaryMax: 70000, tags: ['ionic', 'angular', 'typescript', 'capacitor'], isRemote: false },
  ];

  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: SeedJobsCommand): Promise<{ created: number; message: string }> {
    const count = Math.min(command.count, this.seedData.length);
    let created = 0;

    for (let i = 0; i < count; i++) {
      const data = this.seedData[i % this.seedData.length];

      const job = Job.create({
        title: data.title,
        company: data.company,
        location: data.location,
        isRemote: data.isRemote,
        jobType: new JobType(data.jobType),
        experienceLevel: new ExperienceLevel(data.experienceLevel),
        salaryRange: new SalaryRange(data.salaryMin, data.salaryMax, 'MXN'),
        description: `We are looking for a talented ${data.title} to join our team at ${data.company}. You will work on cutting-edge projects with a talented team.`,
        requirements: `Experience in ${data.tags.join(', ')}. Strong problem-solving skills.`,
        benefits: 'Competitive salary, health insurance, remote work options, learning budget.',
        tags: data.tags,
        applyUrl: `https://${data.company.toLowerCase().replace(/\s+/g, '')}.com/careers`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      // Publish the job so it shows up in listings
      job.publish();

      await this.jobRepository.save(job);
      created++;
    }

    return {
      created,
      message: `Successfully seeded ${created} jobs into the database`,
    };
  }
}
