import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  EntityNotFoundException,
  InvalidValueException,
  BusinessRuleViolationException,
} from '@core/domain/exceptions/domain.exception';

/**
 * Translates Domain exceptions into proper HTTP responses.
 * Domain layer never knows about HTTP — this filter does the translation.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.resolveStatus(exception);

    this.logger.warn(`[DomainException] ${exception.name}: ${exception.message}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveStatus(exception: DomainException): number {
    if (exception instanceof EntityNotFoundException) return HttpStatus.NOT_FOUND;
    if (exception instanceof InvalidValueException) return HttpStatus.UNPROCESSABLE_ENTITY;
    if (exception instanceof BusinessRuleViolationException) return HttpStatus.CONFLICT;
    return HttpStatus.BAD_REQUEST;
  }
}
