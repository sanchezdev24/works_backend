import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Job } from '../../../domain/entities/job.entity';

export class SalaryRangeResponseDto {
  @ApiProperty() min: number | null;
  @ApiProperty() max: number | null;
  @ApiProperty() currency: string;
  @ApiProperty() formatted: string;
}

export class JobResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() company: string;
  @ApiPropertyOptional() companyLogoUrl: string | null;
  @ApiProperty() location: string;
  @ApiProperty() isRemote: boolean;
  @ApiProperty() jobType: string;
  @ApiProperty() experienceLevel: string;
  @ApiProperty({ type: () => SalaryRangeResponseDto }) salary: SalaryRangeResponseDto;
  @ApiProperty() description: string;
  @ApiPropertyOptional() requirements: string | null;
  @ApiPropertyOptional() benefits: string | null;
  @ApiProperty({ type: [String] }) tags: string[];
  @ApiProperty() status: string;
  @ApiPropertyOptional() applyUrl: string | null;
  @ApiPropertyOptional() publishedAt: Date | null;
  @ApiPropertyOptional() expiresAt: Date | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  static fromDomain(job: Job): JobResponseDto {
    const dto = new JobResponseDto();
    dto.id = job.getId().getValue();
    dto.title = job.getTitle();
    dto.company = job.getCompany();
    dto.companyLogoUrl = job.getCompanyLogoUrl();
    dto.location = job.getLocation();
    dto.isRemote = job.getIsRemote();
    dto.jobType = job.getJobType().getValue();
    dto.experienceLevel = job.getExperienceLevel().getValue();
    dto.salary = {
      min: job.getSalaryRange().getMin(),
      max: job.getSalaryRange().getMax(),
      currency: job.getSalaryRange().getCurrency(),
      formatted: job.getSalaryRange().getFormattedRange(),
    };
    dto.description = job.getDescription();
    dto.requirements = job.getRequirements();
    dto.benefits = job.getBenefits();
    dto.tags = job.getTags();
    dto.status = job.getStatus().getValue();
    dto.applyUrl = job.getApplyUrl();
    dto.publishedAt = job.getPublishedAt();
    dto.expiresAt = job.getExpiresAt();
    dto.createdAt = job.getCreatedAt();
    dto.updatedAt = job.getUpdatedAt();
    return dto;
  }
}

export class PaginatedJobsResponseDto {
  @ApiProperty({ type: [JobResponseDto] }) data: JobResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNextPage: boolean;
  @ApiProperty() hasPreviousPage: boolean;
}
