import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-dev-tools',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8 pt-6 border-t border-[var(--base-border-opaque)]">
      <div class="flex items-center justify-between mb-3">
        <p class="base-label-xs uppercase text-[var(--base-content-secondary)]">
          Điền tài khoản kiểm thử
        </p>
        <span class="base-tag base-tag-warning text-[10px] font-mono">DEV ONLY</span>
      </div>
      <div class="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          (click)="selectAccount('admin')"
          class="base-selection-card flex-col items-center text-center !p-3 cursor-pointer">
          <span class="isax-b icon-shield-tick text-xl text-[var(--base-content-primary)]"></span>
          <span class="base-label-xs text-[var(--base-content-primary)] mt-1">Quản Trị</span>
          <span class="base-paragraph-xs text-[var(--base-content-secondary)]">0901234567</span>
        </button>

        <button
          type="button"
          (click)="selectAccount('doctor')"
          class="base-selection-card flex-col items-center text-center !p-3 cursor-pointer">
          <span class="isax-b icon-health text-xl text-[var(--base-brand-blue)]"></span>
          <span class="base-label-xs text-[var(--base-content-primary)] mt-1">Bác Sĩ</span>
          <span class="base-paragraph-xs text-[var(--base-content-secondary)]">0912345678</span>
        </button>

        <button
          type="button"
          (click)="selectAccount('patient')"
          class="base-selection-card flex-col items-center text-center !p-3 cursor-pointer">
          <span class="isax-b icon-user text-xl text-[var(--base-content-info)]"></span>
          <span class="base-label-xs text-[var(--base-content-primary)] mt-1">Bệnh Nhân</span>
          <span class="base-paragraph-xs text-[var(--base-content-secondary)]">0988776655</span>
        </button>
      </div>
    </div>
  `,
})
export class LoginDevToolsComponent {
  @Output() fillCredentials = new EventEmitter<{ phone: string; pass: string }>();

  selectAccount(role: 'admin' | 'doctor' | 'patient') {
    const creds = {
      admin: { phone: '0901234567', pass: 'Admin@123' },
      doctor: { phone: '0912345678', pass: 'Doctor@123' },
      patient: { phone: '0988776655', pass: 'Patient@123' },
    };
    this.fillCredentials.emit(creds[role]);
  }
}
