import {
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedJobsCommand } from '../../../application/commands/seed-jobs.command';
import { JobOrmEntity } from '../../persistence/orm-entities/job.orm-entity';

/**
 * DEV-ONLY Controller.
 * Accessible at: POST /dev/seed/jobs
 *
 * Protected by a guard that blocks any non-development environment.
 * This controller is NOT registered in production.
 */
@ApiTags('🛠 Dev Tools (development only)')
@Controller('dev')
export class JobsSeederController {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(JobOrmEntity)
    private readonly ormRepo: Repository<JobOrmEntity>,
  ) {
    // Double-safety: if somehow instantiated in prod, throw on construction
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Dev endpoints are disabled in production');
    }
  }

  /**
   * POST /dev/seed/jobs?count=20
   * Seeds the database with sample job data.
   */
  @Post('seed/jobs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '🌱 Seed jobs (DEV ONLY)',
    description: 'Populates the database with sample job data. Only available in development environment.',
  })
  @ApiQuery({ name: 'count', required: false, type: Number, description: 'Number of jobs to seed (max 20)' })
  @ApiResponse({ status: 201, description: 'Jobs seeded successfully' })
  @ApiResponse({ status: 403, description: 'Not available in production' })
  async seedJobs(
    @Query('count') count: number = 20,
  ): Promise<{ success: boolean; message: string; created: number }> {
    this.guardDev();

    const command = new SeedJobsCommand(Number(count));
    const result = await this.commandBus.execute(command);

    return {
      success: true,
      message: result.message,
      created: result.created,
    };
  }

  /**
   * DELETE /dev/reset/jobs
   * Wipes all jobs from the database.
   */
  @Delete('reset/jobs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '🗑 Reset jobs table (DEV ONLY)',
    description: 'Deletes ALL jobs from the database. Only available in development.',
  })
  async resetJobs(): Promise<{ success: boolean; message: string; deleted: number }> {
    this.guardDev();

    const count = await this.ormRepo.count();
    await this.ormRepo.clear();

    return {
      success: true,
      message: `Deleted all jobs from the database`,
      deleted: count,
    };
  }

  private guardDev(): void {
    if (process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException(
        'This endpoint is only available in development environment',
      );
    }
  }
}
