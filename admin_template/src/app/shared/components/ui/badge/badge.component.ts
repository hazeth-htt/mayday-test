import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

type BadgeVariant = 'light' | 'solid';
type BadgeSize = 'sm' | 'md';
type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-badge',
  imports: [CommonModule,SafeHtmlPipe],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'light';
  @Input() size: BadgeSize = 'md';
  @Input() color: BadgeColor = 'primary';
  @Input() isaxIcon?: string; // Iconsax icon class e.g. 'icon-tick-circle'
  @Input() startIcon?: string; // HTML string or icon class
  @Input() endIcon?: string;   // HTML string or icon class

  @HostBinding('class') get hostClasses(): string {
    return `inline-flex`;
  }

  get baseStyles() {
    return 'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-md font-semibold tracking-tight transition-colors';
  }

  get sizeClass() {
    return {
      sm: 'text-xs',
      md: 'text-xs py-1 px-3',
    }[this.size];
  }

  get colorStyles() {
    const variants = {
      light: {
        primary: 'bg-[#091F5B]/10 text-[#091F5B] border border-[#091F5B]/20 dark:bg-[#BAD6EB]/15 dark:text-[#BAD6EB]',
        success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
        error: 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
        info: 'bg-blue-50 text-[#1E40AF] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
        light: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300',
        dark: 'bg-slate-800 text-white border border-slate-700 dark:bg-slate-900 dark:text-slate-100',
      },
      solid: {
        primary: 'bg-[#091F5B] text-white hover:bg-[#153275]',
        success: 'bg-emerald-700 text-white',
        error: 'bg-rose-700 text-white',
        warning: 'bg-amber-700 text-white',
        info: 'bg-[#3B63A8] text-white',
        light: 'bg-slate-200 text-slate-800',
        dark: 'bg-slate-900 text-white',
      },
    };
    return variants[this.variant][this.color];
  }
}