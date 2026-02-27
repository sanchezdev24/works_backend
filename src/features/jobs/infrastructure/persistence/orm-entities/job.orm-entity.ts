import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobTypeEnum } from '../../../domain/value-objects/job-type.value-object';
import { ExperienceLevelEnum } from '../../../domain/value-objects/experience-level.value-object';
import { JobStatusEnum } from '../../../domain/value-objects/job-status.value-object';

/**
 * ORM Entity — belongs to Infrastructure layer only.
 * The Domain Entity (Job) is completely separate and unaware of TypeORM.
 */
@Entity('jobs')
@Index(['status', 'publishedAt'])
@Index(['jobType', 'experienceLevel'])
export class JobOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ name: 'company_logo_url', type: 'varchar', length: 500, nullable: true })
  companyLogoUrl: string | null;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'is_remote', type: 'boolean', default: false })
  isRemote: boolean;

  @Column({
    name: 'job_type',
    type: 'enum',
    enum: JobTypeEnum,
    default: JobTypeEnum.FULL_TIME,
  })
  jobType: JobTypeEnum;

  @Column({
    name: 'experience_level',
    type: 'enum',
    enum: ExperienceLevelEnum,
    default: ExperienceLevelEnum.MID,
  })
  experienceLevel: ExperienceLevelEnum;

  @Column({ name: 'salary_min', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMin: number | null;

  @Column({ name: 'salary_max', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMax: number | null;

  @Column({ name: 'salary_currency', type: 'varchar', length: 10, default: 'USD' })
  salaryCurrency: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string | null;

  @Column({ type: 'text', nullable: true })
  benefits: string | null;

  @Column({ type: 'varchar', array: true, default: '{}' })
  tags: string[];

  @Column({
    type: 'enum',
    enum: JobStatusEnum,
    default: JobStatusEnum.DRAFT,
  })
  @Index()
  status: JobStatusEnum;

  @Column({ name: 'apply_url', type: 'varchar', length: 500, nullable: true })
  applyUrl: string | null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  @Index()
  publishedAt: Date | null;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
