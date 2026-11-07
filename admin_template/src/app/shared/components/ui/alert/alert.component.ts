import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alert',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './alert.component.html',
  styles: ``
})
export class AlertComponent {

  @Input() variant: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() showLink: boolean = false;
  @Input() linkHref: string = '#';
  @Input() linkText: string = 'Chi tiết';

  get variantClasses() {
    return {
      success: {
        container: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/20',
        icon: 'text-emerald-700 dark:text-emerald-400',
        title: 'text-emerald-900 dark:text-emerald-200',
        message: 'text-emerald-800 dark:text-emerald-300',
        link: 'text-emerald-900 hover:text-emerald-950 dark:text-emerald-300'
      },
      error: {
        container: 'border-rose-200 bg-rose-50/80 dark:border-rose-800 dark:bg-rose-950/20',
        icon: 'text-rose-700 dark:text-rose-400',
        title: 'text-rose-900 dark:text-rose-200',
        message: 'text-rose-800 dark:text-rose-300',
        link: 'text-rose-900 hover:text-rose-950 dark:text-rose-300'
      },
      warning: {
        container: 'border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/20',
        icon: 'text-amber-700 dark:text-amber-400',
        title: 'text-amber-900 dark:text-amber-200',
        message: 'text-amber-800 dark:text-amber-300',
        link: 'text-amber-900 hover:text-amber-950 dark:text-amber-300'
      },
      info: {
        container: 'border-blue-200 bg-blue-50/80 dark:border-blue-800 dark:bg-blue-950/20',
        icon: 'text-[#3B63A8] dark:text-[#6F96D1]',
        title: 'text-[#091F5B] dark:text-[#BAD6EB]',
        message: 'text-slate-700 dark:text-slate-300',
        link: 'text-[#3B63A8] hover:text-[#091F5B] dark:text-[#6F96D1]'
      }
    }[this.variant];
  }

  get iconClass(): string {
    const icons = {
      success: 'icon-tick-circle',
      error: 'icon-danger',
      warning: 'icon-warning-2',
      info: 'icon-info-circle',
    };
    return icons[this.variant];
  }
}
