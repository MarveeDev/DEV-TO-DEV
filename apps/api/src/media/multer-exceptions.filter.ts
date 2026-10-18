import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MulterError } from 'multer';

/**
 * Maps Multer errors (thrown during multipart parsing, before the controller
 * handler runs) into clean HTTP responses instead of a generic 500.
 */
@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const tooLarge = exception.code === 'LIMIT_FILE_SIZE';
    const status = tooLarge
      ? HttpStatus.PAYLOAD_TOO_LARGE
      : HttpStatus.BAD_REQUEST;
    response.status(status).json({
      statusCode: status,
      message: tooLarge
        ? 'Uploaded file exceeds the maximum allowed size.'
        : 'Invalid file upload.',
    });
  }
}
