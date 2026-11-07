import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: any;
}

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly PHONE_REGEX = /\b(0[35789]\d)(\d{4})(\d{3})\b/g;
  private readonly BHYT_REGEX = /\b([A-Z]{2}\d{2})(\d{7})(\d{4})\b/g;
  private readonly BEARER_REGEX = /Bearer\s+[A-Za-z0-9-_.]+/gi;

  /**
   * Sanitizes all clinical and personal identification information (Zero-PII).
   */
  sanitize(data: any): any {
    if (data === null || data === undefined) return data;

    if (typeof data === 'string') {
      return data
        .replace(this.PHONE_REGEX, '$1****$3')
        .replace(this.BHYT_REGEX, '$1*******$3')
        .replace(this.BEARER_REGEX, 'Bearer [REDACTED_TOKEN]');
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    if (typeof data === 'object') {
      const sanitizedObj: Record<string, any> = {};
      for (const [key, val] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('password') ||
          lowerKey.includes('token') ||
          lowerKey.includes('secret') ||
          lowerKey.includes('auth')
        ) {
          sanitizedObj[key] = '[REDACTED]';
        } else {
          sanitizedObj[key] = this.sanitize(val);
        }
      }
      return sanitizedObj;
    }

    return data;
  }

  log(message: string, context?: any) {
    this.record('info', message, context);
  }

  warn(message: string, context?: any) {
    this.record('warn', message, context);
  }

  error(message: string, context?: any) {
    this.record('error', message, context);
  }

  private record(level: 'info' | 'warn' | 'error', message: string, context?: any) {
    const sanitizedMsg = this.sanitize(message);
    const sanitizedCtx = context ? this.sanitize(context) : undefined;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: sanitizedMsg,
      context: sanitizedCtx,
    };

    if (!environment.production) {
      if (level === 'error') {
        console.error(`[DrMayDay-Clinical-Error] ${entry.message}`, entry.context || '');
      } else if (level === 'warn') {
        console.warn(`[DrMayDay-Warning] ${entry.message}`, entry.context || '');
      } else {
        console.log(`[DrMayDay-Log] ${entry.message}`, entry.context || '');
      }
    }
  }
}
