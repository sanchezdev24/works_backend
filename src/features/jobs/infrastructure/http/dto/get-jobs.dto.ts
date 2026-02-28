import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { JobTypeEnum } from '../../../domain/value-objects/job-type.value-object';
import { ExperienceLevelEnum } from '../../../domain/value-objects/experience-level.value-object';
import { JobStatusEnum } from '../../../domain/value-objects/job-status.value-object';

export class GetJobsDto {
  @ApiPropertyOptional({ description: 'Full-text search in title, company and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: JobTypeEnum })
  @IsOptional()
  @IsEnum(JobTypeEnum)
  job_type?: string;

  @ApiPropertyOptional({ enum: ExperienceLevelEnum })
  @IsOptional()
  @IsEnum(ExperienceLevelEnum)
  experience_level?: string;

  @ApiPropertyOptional({ description: 'Filter remote jobs only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_remote?: boolean;

  @ApiPropertyOptional({ enum: JobStatusEnum, default: JobStatusEnum.ACTIVE })
  @IsOptional()
  @IsEnum(JobStatusEnum)
  status?: string;

  @ApiPropertyOptional({ description: 'Comma-separated tags: flutter,dart' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : value))
  tags?: string[];

  @ApiPropertyOptional({ description: 'Minimum salary filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary_min?: number;

  @ApiPropertyOptional({ description: 'Maximum salary filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary_max?: number;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
