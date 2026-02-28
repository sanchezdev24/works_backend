import { InvalidValueException } from '@core/domain/exceptions/domain.exception';

export class SalaryRange {
  private readonly min: number | null;
  private readonly max: number | null;
  private readonly currency: string;

  constructor(min: number | null, max: number | null, currency: string = 'USD') {
    if (min !== null && min < 0) {
      throw new InvalidValueException('Salary min cannot be negative');
    }
    if (max !== null && max < 0) {
      throw new InvalidValueException('Salary max cannot be negative');
    }
    if (min !== null && max !== null && min > max) {
      throw new InvalidValueException('Salary min cannot be greater than max');
    }
    if (!currency || currency.length > 10) {
      throw new InvalidValueException('Invalid currency code');
    }
    this.min = min;
    this.max = max;
    this.currency = currency.toUpperCase();
  }

  getMin(): number | null {
    return this.min;
  }

  getMax(): number | null {
    return this.max;
  }

  getCurrency(): string {
    return this.currency;
  }

  hasSalary(): boolean {
    return this.min !== null || this.max !== null;
  }

  getFormattedRange(): string {
    if (!this.hasSalary()) return 'Not specified';
    if (this.min && this.max) return `${this.currency} ${this.min.toLocaleString()} - ${this.max.toLocaleString()}`;
    if (this.min) return `From ${this.currency} ${this.min.toLocaleString()}`;
    return `Up to ${this.currency} ${this.max!.toLocaleString()}`;
  }

  equals(other: SalaryRange): boolean {
    return this.min === other.min && this.max === other.max && this.currency === other.currency;
  }
}
