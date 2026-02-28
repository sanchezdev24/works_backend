import { InvalidValueException } from '@core/domain/exceptions/domain.exception';

export enum ExperienceLevelEnum {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager',
}

export class ExperienceLevel {
  private readonly value: ExperienceLevelEnum;

  constructor(value: string) {
    if (!Object.values(ExperienceLevelEnum).includes(value as ExperienceLevelEnum)) {
      throw new InvalidValueException(
        `Invalid experience level: <${value}>. Valid values: ${Object.values(ExperienceLevelEnum).join(', ')}`,
      );
    }
    this.value = value as ExperienceLevelEnum;
  }

  getValue(): ExperienceLevelEnum {
    return this.value;
  }

  isSeniorOrAbove(): boolean {
    return [ExperienceLevelEnum.SENIOR, ExperienceLevelEnum.LEAD, ExperienceLevelEnum.MANAGER].includes(
      this.value,
    );
  }

  toString(): string {
    return this.value;
  }

  equals(other: ExperienceLevel): boolean {
    return this.value === other.value;
  }
}
