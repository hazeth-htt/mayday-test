import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-widget',
  template: `
    <div
      class="mx-auto mb-6 w-full max-w-60 rounded-2xl bg-[var(--base-bg-surface-alt)] p-4 text-center border border-[var(--base-border-opaque)]"
    >
      <div class="h-9 w-9 rounded-xl bg-[var(--base-gray-900)] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm mx-auto mb-2 shadow-sm">
        <span class="isax-b icon-call text-base text-[var(--base-content-accent)]"></span>
      </div>
      <h3 class="mb-1 text-xs font-bold text-[var(--base-content-primary)]">
        Bệnh viện Da liễu TW
      </h3>
      <p class="mb-2 text-[11px] text-[var(--base-content-secondary)]">
        Hotline hỗ trợ & Cấp cứu:
        <a href="tel:19006951" class="block font-bold text-[var(--base-content-accent)] font-mono text-xs mt-0.5 hover:underline">1900 6951</a>
      </p>
      <div class="text-[10px] text-[var(--base-content-tertiary)]">
        Hệ thống Khám chuyên khoa
      </div>
    </div>
  `
})
export class SidebarWidgetComponent {}
