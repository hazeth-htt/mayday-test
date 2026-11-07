import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { LoggingService } from '../services/logging.service';
import { Location } from '@angular/common';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private loggingService = inject(LoggingService);
  private location = inject(Location);
  private ngZone = inject(NgZone);

  handleError(error: any): void {
    const currentUrl = this.location.path() || window.location.pathname;
    const message = error?.message || error?.toString() || 'Unknown runtime error';
    const stack = error?.stack || '';

    this.loggingService.error(`Unhandled Exception at ${currentUrl}: ${message}`, {
      stack,
      url: currentUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
