import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../components/common/theme-toggle/theme-toggle-button.component';
import { NotificationDropdownComponent } from '../../components/header/notification-dropdown/notification-dropdown.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    NotificationDropdownComponent,
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  getRoleName(role: string | null): string {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'doctor': return 'Bác sĩ';
      case 'patient': return 'Bệnh nhân';
      default: return '';
    }
  }

  getRoleIcon(role: string | null): string {
    switch (role) {
      case 'admin': return 'isax-b icon-shield-tick';
      case 'doctor': return 'isax-b icon-health';
      case 'patient': return 'isax-b icon-user';
      default: return 'isax icon-user';
    }
  }

  getRoleBadgeClass(role: string | null): string {
    switch (role) {
      case 'admin': return 'text-[var(--base-content-primary)] bg-[var(--base-bg-surface-alt)] border border-[var(--base-border-opaque)]';
      case 'doctor': return 'text-[var(--base-content-accent)] bg-[var(--base-bg-info-tint)] border border-[var(--base-border-info)]';
      case 'patient': return 'text-[var(--base-positive-primary)] bg-[var(--base-bg-positive-tint)] border border-[var(--base-border-positive)]';
      default: return 'text-[var(--base-content-tertiary)]';
    }
  }

  handleLogout() {
    this.auth.logout();
  }

  ngAfterViewInit() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}
