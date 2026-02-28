import { ICommand } from '@nestjs/cqrs';

export class SeedJobsCommand implements ICommand {
  constructor(public readonly count: number = 20) {}
}
