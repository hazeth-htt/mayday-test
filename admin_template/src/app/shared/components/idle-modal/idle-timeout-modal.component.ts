import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdleTimeoutService } from '../../../core/services/idle-timeout.service';

@Component({
  selector: 'app-idle-timeout-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (idleService.isWarningOpen()) {
      <div
        class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="idle-modal-title"
      >
        <div class="base-card max-w-md w-full p-6 text-center shadow-2xl border border-[var(--base-border-opaque)]">
          <div class="h-16 w-16 mx-auto mb-4 rounded-full bg-[var(--base-bg-warning-tint)] text-[var(--base-warning-primary)] flex items-center justify-center">
            <span class="isax-b icon-clock text-3xl"></span>
          </div>

          <h2 id="idle-modal-title" class="base-heading-md text-[var(--base-content-primary)] mb-2">
            Phiên Khám Sắp Tự Động Khóa
          </h2>

          <p class="base-paragraph-xs text-[var(--base-content-secondary)] mb-4">
            Hệ thống phát hiện không có thao tác trong gần 15 phút. Để bảo mật hồ sơ bệnh án, phiên làm việc sẽ tự động kết thúc sau:
          </p>

          <div class="my-4 p-4 rounded-xl bg-[var(--base-bg-surface-alt)] border border-[var(--base-border-opaque)]">
            <span class="text-4xl font-mono font-black text-[var(--base-warning-primary)] block">
              00:{{ idleService.countdownSeconds() < 10 ? '0' : '' }}{{ idleService.countdownSeconds() }}
            </span>
            <span class="base-label-xs uppercase text-[var(--base-content-tertiary)] mt-1 block">
              giây đếm lùi
            </span>
          </div>

          <div class="space-y-2 pt-2">
            <button
              type="button"
              (click)="idleService.stayLoggedIn()"
              class="base-btn base-btn-primary base-btn-large w-full cursor-pointer flex items-center justify-center gap-2"
            >
              <span class="isax-b icon-tick-circle text-lg"></span>
              <span>Tiếp Tục Phiên Khám</span>
            </button>

            <button
              type="button"
              (click)="idleService.logoutNow()"
              class="base-btn base-btn-tertiary base-btn-compact w-full cursor-pointer text-[var(--base-negative-primary)]"
            >
              <span>Đăng xuất ngay</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class IdleTimeoutModalComponent {
  idleService = inject(IdleTimeoutService);
}
