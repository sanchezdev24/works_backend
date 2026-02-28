import { ICommand } from '@nestjs/cqrs';

export class CreateJobCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly company: string,
    public readonly location: string,
    public readonly isRemote: boolean,
    public readonly jobType: string,
    public readonly experienceLevel: string,
    public readonly description: string,
    public readonly salaryMin?: number | null,
    public readonly salaryMax?: number | null,
    public readonly salaryCurrency?: string,
    public readonly requirements?: string | null,
    public readonly benefits?: string | null,
    public readonly tags?: string[],
    public readonly applyUrl?: string | null,
    public readonly companyLogoUrl?: string | null,
    public readonly expiresAt?: Date | null,
    public readonly publishImmediately: boolean = false,
  ) {}
}
