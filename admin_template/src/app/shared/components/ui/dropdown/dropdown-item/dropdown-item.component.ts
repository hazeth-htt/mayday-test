import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  imports: [CommonModule, RouterModule]
})
export class DropdownItemComponent {
  @Input() to?: string;
  @Input() baseClassName = 'flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white transition-colors cursor-pointer';
  @Input() className = '';
  @Output() itemClick = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  get combinedClasses(): string {
    return `${this.baseClassName} ${this.className}`.trim();
  }

  handleClick(event: Event) {
    event.preventDefault();
    this.click.emit();
    this.itemClick.emit();
  }
}