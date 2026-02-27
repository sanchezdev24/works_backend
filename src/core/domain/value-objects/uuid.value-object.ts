import { v4 as uuidv4, validate } from 'uuid';

export class Uuid {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? uuidv4();
    this.ensureIsValid(this.value);
  }

  private ensureIsValid(value: string): void {
    if (!validate(value)) {
      throw new Error(`<${value}> is not a valid UUID`);
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Uuid): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): Uuid {
    return new Uuid(uuidv4());
  }
}
