import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetJobsQuery } from '../../../application/queries/get-jobs.query';
import { GetJobByIdQuery } from '../../../application/queries/get-job-by-id.query';
import { CreateJobCommand } from '../../../application/commands/create-job.command';
import { GetJobsDto } from '../dto/get-jobs.dto';
import { CreateJobDto } from '../dto/create-job.dto';
import {
  JobResponseDto,
  PaginatedJobsResponseDto,
} from '../dto/job-response.dto';
import { Job } from '../../../domain/entities/job.entity';
import { PaginatedResult } from '@core/domain/value-objects/pagination.value-object';

@ApiTags('Jobs')
@Controller('jobs')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class JobsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * GET /jobs
   * Returns paginated list of jobs with filters.
   * Used by the Flutter dashboard feature.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated jobs list',
    description: 'Returns paginated jobs. Supports full-text search, filters by type, level, remote, salary and tags.',
  })
  @ApiResponse({ status: 200, type: PaginatedJobsResponseDto })
  async getJobs(@Query() dto: GetJobsDto): Promise<{
    success: boolean;
    data: PaginatedJobsResponseDto;
  }> {
    const query = new GetJobsQuery(
      dto.search,
      dto.job_type,
      dto.experience_level,
      dto.is_remote,
      dto.status,
      dto.tags,
      dto.salary_min,
      dto.salary_max,
      dto.page,
      dto.limit,
    );

    const result: PaginatedResult<Job> = await this.queryBus.execute(query);

    return {
      success: true,
      data: {
        data: result.data.map(JobResponseDto.fromDomain),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      },
    };
  }

  /**
   * GET /jobs/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({ status: 200, type: JobResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJobById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean; data: JobResponseDto }> {
    const query = new GetJobByIdQuery(id);
    const job: Job = await this.queryBus.execute(query);

    return {
      success: true,
      data: JobResponseDto.fromDomain(job),
    };
  }

  /**
   * POST /jobs
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, type: JobResponseDto })
  async createJob(
    @Body() dto: CreateJobDto,
  ): Promise<{ success: boolean; data: JobResponseDto; message: string }> {
    const command = new CreateJobCommand(
      dto.title,
      dto.company,
      dto.location,
      dto.is_remote,
      dto.job_type,
      dto.experience_level,
      dto.description,
      dto.salary_min,
      dto.salary_max,
      dto.salary_currency,
      dto.requirements,
      dto.benefits,
      dto.tags,
      dto.apply_url,
      dto.company_logo_url,
      dto.expires_at,
      dto.publish_immediately ?? false,
    );

    const job: Job = await this.commandBus.execute(command);

    return {
      success: true,
      data: JobResponseDto.fromDomain(job),
      message: 'Job created successfully',
    };
  }
}
