import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef, inject, computed } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { SidebarWidgetComponent } from './app-sidebar-widget.component';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const ADMIN_NAV: NavItem[] = [
  {
    icon: `<span class="isax icon-element-plus text-xl"></span>`,
    name: 'Bảng Điều Khiển Quản Trị',
    path: '/admin/dashboard',
  },
  {
    icon: `<span class="isax icon-hospital text-xl"></span>`,
    name: 'Cơ Sở & Hạ Tầng Tổ Chức',
    path: '/admin/topology',
  },
  {
    icon: `<span class="isax icon-profile-2user text-xl"></span>`,
    name: 'Danh Bạ Nhân Sự Y Tế',
    path: '/admin/users',
  },
  {
    icon: `<span class="isax icon-shield-tick text-xl"></span>`,
    name: 'Ma Trận Vai Trò & Phân Quyền',
    path: '/admin/rbac',
  },
  {
    icon: `<span class="isax icon-document-text text-xl"></span>`,
    name: 'Bộ Tạo Mẫu Phiếu Khám',
    path: '/admin/form-builder',
  },
];

const DOCTOR_NAV: NavItem[] = [
  {
    icon: `<span class="isax icon-user-tick text-xl"></span>`,
    name: 'Hàng Đợi Tiếp Nhận Ca Khám',
    path: '/doctor/queue',
  },
  {
    icon: `<span class="isax icon-activity text-xl"></span>`,
    name: 'Phòng Khám Lâm Sàng',
    path: '/doctor/queue',
  },
];

const PATIENT_NAV: NavItem[] = [
  {
    icon: `<span class="isax icon-home-2 text-xl"></span>`,
    name: 'Trang Chủ Người Bệnh',
    path: '/patient/home',
  },
  {
    icon: `<span class="isax-b icon-danger text-xl text-rose-500"></span>`,
    name: 'Sàng Lọc Nguy Cấp (<30s)',
    path: '/patient/emergency',
  },
  {
    icon: `<span class="isax icon-clipboard-text text-xl"></span>`,
    name: 'Phiếu Khai Thác Bệnh Sử',
    path: '/patient/intake',
  },
  {
    icon: `<span class="isax icon-chart text-xl"></span>`,
    name: 'Nhật Ký Hoạt Tính UAS7',
    path: '/patient/uas7',
  },
  {
    icon: `<span class="isax icon-camera text-xl"></span>`,
    name: 'Nhật Ký Tổn Thương Da',
    path: '/patient/lesions',
  },
  {
    icon: `<span class="isax icon-document text-xl"></span>`,
    name: 'Hồ Sơ Y Tế Cá Nhân',
    path: '/patient/profile',
  },
  {
    icon: `<span class="isax icon-archive-book text-xl"></span>`,
    name: 'Lịch Sử Hồ Sơ Bệnh Án',
    path: '/patient/records',
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    SidebarWidgetComponent
  ],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent {
  auth = inject(AuthService);

  get navItems(): NavItem[] {
    const role = this.auth.currentRole();
    if (role === 'admin') return ADMIN_NAV;
    if (role === 'doctor') return DOCTOR_NAV;
    if (role === 'patient') return PATIENT_NAV;
    return [];
  }

  // No othersItems for clean product UX
  othersItems: NavItem[] = [];

  openSubmenu: string | null | number = 'main-0';
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        () => {
          this.cdr.detectChanges();
        }
      )
    );

    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe((expanded) => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
    ];

    menuGroups.forEach((group) => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges();
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    this.isMobileOpen$.subscribe((isMobile) => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }
}
