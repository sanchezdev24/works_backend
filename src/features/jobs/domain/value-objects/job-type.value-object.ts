import { InvalidValueException } from '@core/domain/exceptions/domain.exception';

export enum JobTypeEnum {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export class JobType {
  private readonly value: JobTypeEnum;

  constructor(value: string) {
    if (!Object.values(JobTypeEnum).includes(value as JobTypeEnum)) {
      throw new InvalidValueException(
        `Invalid job type: <${value}>. Valid values: ${Object.values(JobTypeEnum).join(', ')}`,
      );
    }
    this.value = value as JobTypeEnum;
  }

  getValue(): JobTypeEnum {
    return this.value;
  }

  isFullTime(): boolean {
    return this.value === JobTypeEnum.FULL_TIME;
  }

  isRemote(): boolean {
    return [JobTypeEnum.FREELANCE, JobTypeEnum.CONTRACT].includes(this.value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: JobType): boolean {
    return this.value === other.value;
  }
}
