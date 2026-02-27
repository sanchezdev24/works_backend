import { IQuery } from '@nestjs/cqrs';

export class GetJobByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
