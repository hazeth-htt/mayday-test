import { Injectable, signal, inject, NgZone, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class IdleTimeoutService implements OnDestroy {
  private auth = inject(AuthService);
  private ngZone = inject(NgZone);

  // Default: 15 minutes total, 60 seconds warning
  private readonly IDLE_LIMIT_MS = 15 * 60 * 1000;
  private readonly WARNING_DURATION_MS = 60 * 1000;

  isWarningOpen = signal<boolean>(false);
  countdownSeconds = signal<number>(60);

  private idleTimer: any = null;
  private countdownTimer: any = null;
  private isListening = false;

  private readonly userActivityListener = () => this.handleUserActivity();

  startMonitoring() {
    if (this.isListening) return;

    const role = this.auth.currentRole();
    if (!this.auth.isAuthenticated() || (role !== 'doctor' && role !== 'admin')) {
      return;
    }

    this.isListening = true;
    this.resetTimer();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.userActivityListener, { passive: true });
      window.addEventListener('keydown', this.userActivityListener, { passive: true });
      window.addEventListener('click', this.userActivityListener, { passive: true });
      window.addEventListener('scroll', this.userActivityListener, { passive: true });
      window.addEventListener('touchstart', this.userActivityListener, { passive: true });
    });
  }

  stopMonitoring() {
    this.clearAllTimers();
    this.isWarningOpen.set(false);
    this.isListening = false;

    window.removeEventListener('mousemove', this.userActivityListener);
    window.removeEventListener('keydown', this.userActivityListener);
    window.removeEventListener('click', this.userActivityListener);
    window.removeEventListener('scroll', this.userActivityListener);
    window.removeEventListener('touchstart', this.userActivityListener);
  }

  resetTimer() {
    this.clearAllTimers();
    this.isWarningOpen.set(false);
    this.countdownSeconds.set(60);

    const warnAfterMs = this.IDLE_LIMIT_MS - this.WARNING_DURATION_MS;
    this.idleTimer = setTimeout(() => {
      this.triggerWarning();
    }, warnAfterMs);
  }

  stayLoggedIn() {
    this.resetTimer();
  }

  logoutNow() {
    this.stopMonitoring();
    this.auth.logout();
  }

  private handleUserActivity() {
    // If warning modal is already open, do not silently dismiss; require user to click "Tiếp Tục"
    if (!this.isWarningOpen()) {
      this.resetTimer();
    }
  }

  private triggerWarning() {
    this.ngZone.run(() => {
      this.isWarningOpen.set(true);
      this.countdownSeconds.set(60);

      this.countdownTimer = setInterval(() => {
        const remaining = this.countdownSeconds() - 1;
        this.countdownSeconds.set(remaining);

        if (remaining <= 0) {
          this.clearAllTimers();
          this.logoutNow();
        }
      }, 1000);
    });
  }

  private clearAllTimers() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  ngOnDestroy() {
    this.stopMonitoring();
  }
}
