import { InvalidValueException } from '@core/domain/exceptions/domain.exception';

export enum JobStatusEnum {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
  DRAFT = 'draft',
}

export class JobStatus {
  private readonly value: JobStatusEnum;

  constructor(value: string) {
    if (!Object.values(JobStatusEnum).includes(value as JobStatusEnum)) {
      throw new InvalidValueException(`Invalid job status: <${value}>`);
    }
    this.value = value as JobStatusEnum;
  }

  getValue(): JobStatusEnum {
    return this.value;
  }

  isActive(): boolean {
    return this.value === JobStatusEnum.ACTIVE;
  }

  isClosed(): boolean {
    return this.value === JobStatusEnum.CLOSED;
  }

  canTransitionTo(newStatus: JobStatus): boolean {
    const transitions: Record<JobStatusEnum, JobStatusEnum[]> = {
      [JobStatusEnum.DRAFT]: [JobStatusEnum.ACTIVE],
      [JobStatusEnum.ACTIVE]: [JobStatusEnum.PAUSED, JobStatusEnum.CLOSED],
      [JobStatusEnum.PAUSED]: [JobStatusEnum.ACTIVE, JobStatusEnum.CLOSED],
      [JobStatusEnum.CLOSED]: [],
    };
    return transitions[this.value].includes(newStatus.getValue());
  }

  toString(): string {
    return this.value;
  }

  equals(other: JobStatus): boolean {
    return this.value === other.value;
  }
}
