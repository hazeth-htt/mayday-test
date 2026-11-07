import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

@Component({
  selector: 'app-button',
  imports: [
    CommonModule,
    SafeHtmlPipe,
  ],
  templateUrl: './button.component.html',
  styles: ``,
  host: {

  },
})
export class ButtonComponent {

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'soft' | 'danger' | 'ghost' = 'primary';
  @Input() disabled = false;
  @Input() className = '';
  @Input() isaxIcon?: string; // Iconsax class e.g. 'icon-add'
  @Input() startIcon?: string;
  @Input() endIcon?: string;

  @Output() btnClick = new EventEmitter<Event>();

  get sizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'h-8 px-3 text-xs';
      case 'lg':
        return 'h-11 px-5 text-sm';
      case 'md':
      default:
        return 'h-9.5 px-4 text-xs font-semibold';
    }
  }

  get variantClasses(): string {
    switch (this.variant) {
      case 'secondary':
        return 'bg-[#3B63A8] text-white hover:bg-[#2F518D] shadow-sm';
      case 'outline':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700/50';
      case 'soft':
        return 'bg-[#091F5B]/10 text-[#091F5B] hover:bg-[#091F5B]/15 dark:bg-[#BAD6EB]/15 dark:text-[#BAD6EB]';
      case 'danger':
        return 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10';
      case 'primary':
      default:
        return 'bg-[#091F5B] text-white hover:bg-[#153275] shadow-sm disabled:bg-gray-300';
    }
  }

  get disabledClasses(): string {
    return this.disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : '';
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}
