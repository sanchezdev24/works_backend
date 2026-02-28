import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { JobTypeEnum } from '../../../domain/value-objects/job-type.value-object';
import { ExperienceLevelEnum } from '../../../domain/value-objects/experience-level.value-object';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Flutter Developer' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Citi Banamex' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  company: string;

  @ApiPropertyOptional({ example: 'https://company.com/logo.png' })
  @IsOptional()
  @IsUrl()
  company_logo_url?: string;

  @ApiProperty({ example: 'Mexico City, MX' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  location: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_remote: boolean;

  @ApiProperty({ enum: JobTypeEnum, example: JobTypeEnum.FULL_TIME })
  @IsEnum(JobTypeEnum)
  job_type: string;

  @ApiProperty({ enum: ExperienceLevelEnum, example: ExperienceLevelEnum.SENIOR })
  @IsEnum(ExperienceLevelEnum)
  experience_level: string;

  @ApiProperty({ example: 'We are looking for a talented developer...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 80000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary_min?: number;

  @ApiPropertyOptional({ example: 120000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary_max?: number;

  @ApiPropertyOptional({ example: 'MXN', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  salary_currency?: string;

  @ApiPropertyOptional({ example: '5+ years Flutter, Clean Architecture...' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ example: 'Health insurance, remote work, ESOP...' })
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiPropertyOptional({ example: ['flutter', 'dart', 'mobile'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'https://company.com/apply' })
  @IsOptional()
  @IsUrl()
  apply_url?: string;

  @ApiPropertyOptional({ description: 'Publish job immediately after creation' })
  @IsOptional()
  @IsBoolean()
  publish_immediately?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_at?: Date;
}
