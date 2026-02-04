import { SetMetadata } from '@nestjs/common';
import { SkipThrottle as NestSkipThrottle } from '@nestjs/throttler';

/**
 * Skip rate limiting for specific endpoints
 * Re-export from @nestjs/throttler for convenience
 */
export const SkipThrottle = NestSkipThrottle;
