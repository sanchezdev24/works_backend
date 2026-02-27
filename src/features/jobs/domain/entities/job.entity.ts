import { Uuid } from '@core/domain/value-objects/uuid.value-object';
import { BusinessRuleViolationException } from '@core/domain/exceptions/domain.exception';
import { JobType } from '../value-objects/job-type.value-object';
import { ExperienceLevel } from '../value-objects/experience-level.value-object';
import { SalaryRange } from '../value-objects/salary-range.value-object';
import { JobStatus, JobStatusEnum } from '../value-objects/job-status.value-object';

export interface JobProps {
  id: Uuid;
  title: string;
  company: string;
  companyLogoUrl: string | null;
  location: string;
  isRemote: boolean;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange: SalaryRange;
  description: string;
  requirements: string | null;
  benefits: string | null;
  tags: string[];
  status: JobStatus;
  applyUrl: string | null;
  publishedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Rich Domain Entity — contains business logic, not just data
 */
export class Job {
  private readonly props: JobProps;

  private constructor(props: JobProps) {
    this.props = props;
  }

  // ─── Factory Methods ─────────────────────────────────────────────────────────

  static create(params: {
    title: string;
    company: string;
    companyLogoUrl?: string | null;
    location: string;
    isRemote: boolean;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    salaryRange: SalaryRange;
    description: string;
    requirements?: string | null;
    benefits?: string | null;
    tags?: string[];
    applyUrl?: string | null;
    expiresAt?: Date | null;
  }): Job {
    const now = new Date();
    return new Job({
      id: Uuid.generate(),
      title: params.title,
      company: params.company,
      companyLogoUrl: params.companyLogoUrl ?? null,
      location: params.location,
      isRemote: params.isRemote,
      jobType: params.jobType,
      experienceLevel: params.experienceLevel,
      salaryRange: params.salaryRange,
      description: params.description,
      requirements: params.requirements ?? null,
      benefits: params.benefits ?? null,
      tags: params.tags ?? [],
      status: new JobStatus(JobStatusEnum.DRAFT),
      applyUrl: params.applyUrl ?? null,
      publishedAt: null,
      expiresAt: params.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: JobProps): Job {
    return new Job(props);
  }

  // ─── Business Logic ───────────────────────────────────────────────────────────

  publish(): void {
    const activeStatus = new JobStatus(JobStatusEnum.ACTIVE);
    if (!this.props.status.canTransitionTo(activeStatus)) {
      throw new BusinessRuleViolationException(
        `Job cannot transition from <${this.props.status.getValue()}> to <active>`,
      );
    }
    this.props.status = activeStatus;
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  close(): void {
    const closedStatus = new JobStatus(JobStatusEnum.CLOSED);
    if (!this.props.status.canTransitionTo(closedStatus)) {
      throw new BusinessRuleViolationException(
        `Job cannot transition from <${this.props.status.getValue()}> to <closed>`,
      );
    }
    this.props.status = closedStatus;
    this.props.updatedAt = new Date();
  }

  pause(): void {
    const pausedStatus = new JobStatus(JobStatusEnum.PAUSED);
    if (!this.props.status.canTransitionTo(pausedStatus)) {
      throw new BusinessRuleViolationException(
        `Job cannot transition from <${this.props.status.getValue()}> to <paused>`,
      );
    }
    this.props.status = pausedStatus;
    this.props.updatedAt = new Date();
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return new Date() > this.props.expiresAt;
  }

  isVisible(): boolean {
    return this.props.status.isActive() && !this.isExpired();
  }

  addTag(tag: string): void {
    const normalized = tag.toLowerCase().trim();
    if (!this.props.tags.includes(normalized)) {
      this.props.tags.push(normalized);
      this.props.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    const normalized = tag.toLowerCase().trim();
    this.props.tags = this.props.tags.filter((t) => t !== normalized);
    this.props.updatedAt = new Date();
  }

  updateSalary(salaryRange: SalaryRange): void {
    this.props.salaryRange = salaryRange;
    this.props.updatedAt = new Date();
  }

  // ─── Getters ──────────────────────────────────────────────────────────────────

  getId(): Uuid { return this.props.id; }
  getTitle(): string { return this.props.title; }
  getCompany(): string { return this.props.company; }
  getCompanyLogoUrl(): string | null { return this.props.companyLogoUrl; }
  getLocation(): string { return this.props.location; }
  getIsRemote(): boolean { return this.props.isRemote; }
  getJobType(): JobType { return this.props.jobType; }
  getExperienceLevel(): ExperienceLevel { return this.props.experienceLevel; }
  getSalaryRange(): SalaryRange { return this.props.salaryRange; }
  getDescription(): string { return this.props.description; }
  getRequirements(): string | null { return this.props.requirements; }
  getBenefits(): string | null { return this.props.benefits; }
  getTags(): string[] { return [...this.props.tags]; }
  getStatus(): JobStatus { return this.props.status; }
  getApplyUrl(): string | null { return this.props.applyUrl; }
  getPublishedAt(): Date | null { return this.props.publishedAt; }
  getExpiresAt(): Date | null { return this.props.expiresAt; }
  getCreatedAt(): Date { return this.props.createdAt; }
  getUpdatedAt(): Date { return this.props.updatedAt; }
}
