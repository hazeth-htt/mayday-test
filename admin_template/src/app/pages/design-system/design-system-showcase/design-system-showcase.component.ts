import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

interface IconItem {
  name: string;
  category: 'medical' | 'document' | 'time' | 'user' | 'action' | 'system';
}

interface LabResultDemo {
  name: string;
  category: string;
  value: number;
  unit: string;
  minRef: number;
  maxRef: number;
  status: 'normal' | 'high' | 'low';
}

interface PrescriptionItemDemo {
  id: string;
  medicationName: string;
  activeIngredient: string;
  dosage: string;
  quantity: number;
  unit: string;
  instructions: string;
  warning?: string;
}

@Component({
  selector: 'app-design-system-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent,
    BadgeComponent,
    AlertComponent,
    ModalComponent,
    ComponentCardComponent,
    PageBreadcrumbComponent,
  ],
  templateUrl: './design-system-showcase.component.html',
})
export class DesignSystemShowcaseComponent {
  // Active Navigation Tab
  activeSection: 'foundations' | 'icons' | 'components' | 'healthcare' | 'guidelines' = 'foundations';

  // Density Mode Toggle (Uber Base principle)
  densityMode: 'patient' | 'clinician' = 'clinician';

  // Modal demo
  isDemoModalOpen = false;

  // Active list item in demo
  activeListItem = 1;

  // Icon Display Mode
  iconStyle: 'outline' | 'bold' = 'outline';
  iconSearchQuery = '';
  selectedIconCategory: string = 'all';

  // Interactive Button State
  isBtnLoading = false;

  // Interactive Form Inputs
  demoInputText = 'TS.BS. Nguyễn Văn Hùng';
  demoSearchText = '';
  demoErrorInput = 'Penicillin 500mg';
  hasInputError = true;

  // UAS7 Slider interactive
  uasHss = 2;
  uasIss = 2;

  // Interactive Tab Demos
  demoActiveTab: 'overview' | 'metrics' | 'settings' = 'overview';
  demoActivePill: 'daily' | 'weekly' | 'monthly' = 'daily';

  // Copied feedback
  copiedItem: string | null = null;

  // Curated Representative Iconsax Library (Extracted from bundle.css)
  iconsList: IconItem[] = [
    // Medical & Health
    { name: 'heart', category: 'medical' },
    { name: 'heart-tick', category: 'medical' },
    { name: 'heart-circle', category: 'medical' },
    { name: 'activity', category: 'medical' },
    { name: 'health', category: 'medical' },
    { name: 'shield-tick', category: 'medical' },
    { name: 'scanning', category: 'medical' },
    { name: 'radar', category: 'medical' },
    { name: 'security-user', category: 'medical' },
    { name: 'firstline', category: 'medical' },
    { name: 'hospital', category: 'medical' },
    { name: 'recovery-convert', category: 'medical' },

    // Document & Records
    { name: 'document', category: 'document' },
    { name: 'document-text', category: 'document' },
    { name: 'document-normal', category: 'document' },
    { name: 'clipboard', category: 'document' },
    { name: 'clipboard-text', category: 'document' },
    { name: 'clipboard-tick', category: 'document' },
    { name: 'note', category: 'document' },
    { name: 'task', category: 'document' },
    { name: 'archive', category: 'document' },
    { name: 'folder', category: 'document' },
    { name: 'folder-2', category: 'document' },
    { name: 'data', category: 'document' },
    { name: 'chart', category: 'document' },
    { name: 'graph', category: 'document' },

    // Time & Calendar
    { name: 'calendar', category: 'time' },
    { name: 'calendar-1', category: 'time' },
    { name: 'calendar-2', category: 'time' },
    { name: 'calendar-tick', category: 'time' },
    { name: 'clock', category: 'time' },
    { name: 'timer', category: 'time' },
    { name: 'timer-1', category: 'time' },
    { name: 'alarm', category: 'time' },
    { name: 'watch', category: 'time' },

    // User & Organization
    { name: 'user', category: 'user' },
    { name: 'user-cirlce-add', category: 'user' },
    { name: 'user-tag', category: 'user' },
    { name: 'user-tick', category: 'user' },
    { name: 'profile-2user', category: 'user' },
    { name: 'profile-circle', category: 'user' },
    { name: 'profile-tick', category: 'user' },
    { name: 'people', category: 'user' },

    // Actions & Communication
    { name: 'search-normal', category: 'action' },
    { name: 'search-normal-1', category: 'action' },
    { name: 'message', category: 'action' },
    { name: 'message-text', category: 'action' },
    { name: 'messages-1', category: 'action' },
    { name: 'call', category: 'action' },
    { name: 'call-calling', category: 'action' },
    { name: 'notification', category: 'action' },
    { name: 'notification-bing', category: 'action' },
    { name: 'sms', category: 'action' },
    { name: 'send-2', category: 'action' },
    { name: 'share', category: 'action' },

    // Navigation & System
    { name: 'home', category: 'system' },
    { name: 'home-2', category: 'system' },
    { name: 'setting-2', category: 'system' },
    { name: 'filter', category: 'system' },
    { name: 'filter-edit', category: 'system' },
    { name: 'add', category: 'system' },
    { name: 'add-circle', category: 'system' },
    { name: 'trash', category: 'system' },
    { name: 'edit', category: 'system' },
    { name: 'edit-2', category: 'system' },
    { name: 'tick-circle', category: 'system' },
    { name: 'close-circle', category: 'system' },
    { name: 'arrow-right-3', category: 'system' },
    { name: 'arrow-left-2', category: 'system' },
    { name: 'more', category: 'system' },
    { name: 'eye', category: 'system' },
    { name: 'eye-slash', category: 'system' },
    { name: 'camera', category: 'system' },
    { name: 'gallery', category: 'system' },
    { name: 'info-circle', category: 'system' },
    { name: 'warning-2', category: 'system' },
    { name: 'danger', category: 'system' }
  ];

  get filteredIcons(): IconItem[] {
    const q = this.iconSearchQuery.toLowerCase().trim();
    return this.iconsList.filter(icon => {
      const matchCat = this.selectedIconCategory === 'all' || icon.category === this.selectedIconCategory;
      const matchName = !q || icon.name.toLowerCase().includes(q);
      return matchCat && matchName;
    });
  }

  // Healthcare Demo: Lab Results
  labResults: LabResultDemo[] = [
    {
      name: 'Định lượng IgE Toàn phần (Serum Total IgE)',
      category: 'Miễn dịch học',
      value: 342,
      unit: 'IU/mL',
      minRef: 0,
      maxRef: 100,
      status: 'high',
    },
    {
      name: 'Tỷ lệ Bạch cầu Ái toan (Eosinophil %)',
      category: 'Huyết học',
      value: 7.8,
      unit: '%',
      minRef: 1.0,
      maxRef: 6.0,
      status: 'high',
    },
    {
      name: 'Kháng thể Anti-TPO Tuyến giáp',
      category: 'Tự miễn',
      value: 12.4,
      unit: 'IU/mL',
      minRef: 0,
      maxRef: 34,
      status: 'normal',
    },
    {
      name: 'Protein phản ứng C (hs-CRP)',
      category: 'Viêm toàn thân',
      value: 2.1,
      unit: 'mg/L',
      minRef: 0,
      maxRef: 5.0,
      status: 'normal',
    },
  ];

  // Prescription Demo
  newDrug = {
    medicationName: '',
    activeIngredient: '',
    dosage: '180mg',
    quantity: 14,
    unit: 'viên',
    instructions: 'Uống 1 viên vào buổi tối sau ăn no',
  };

  allergyWarning: string | null = null;

  prescriptionsList: PrescriptionItemDemo[] = [
    {
      id: 'rx-01',
      medicationName: 'Fexofenadine Hydrochloride 180mg',
      activeIngredient: 'Fexofenadine HCl',
      dosage: '180mg',
      quantity: 28,
      unit: 'viên',
      instructions: 'Uống 1 viên sáng, 1 viên tối sau ăn (Bậc 2 tăng liều x2)',
    },
    {
      id: 'rx-02',
      medicationName: 'Levocetirizine Dihydrochloride 5mg',
      activeIngredient: 'Levocetirizine',
      dosage: '5mg',
      quantity: 10,
      unit: 'viên',
      instructions: 'Uống 1 viên khi có cơn ngứa bùng phát ban đêm',
    },
  ];

  copyCode(code: string, label: string) {
    navigator.clipboard?.writeText(code);
    this.copiedItem = label;
    setTimeout(() => {
      this.copiedItem = null;
    }, 2000);
  }

  toggleButtonLoading() {
    this.isBtnLoading = true;
    setTimeout(() => {
      this.isBtnLoading = false;
    }, 2000);
  }

  handleAddDrug() {
    this.allergyWarning = null;
    const nameLower = this.newDrug.medicationName.toLowerCase();
    const ingLower = this.newDrug.activeIngredient.toLowerCase();

    // Clinical Safety Rule: Check against patient allergies
    if (nameLower.includes('penicillin') || ingLower.includes('penicillin') || nameLower.includes('aspirin') || ingLower.includes('aspirin')) {
      this.allergyWarning = `BÁO ĐỘNG LÂM SÀNG CẤP 1: Bệnh nhân có tiền sử SỐC PHẢN VỆ với nhóm "${this.newDrug.medicationName || this.newDrug.activeIngredient}"! Hệ thống chặn kê đơn thuốc này.`;
      return;
    }

    if (!this.newDrug.medicationName.trim()) {
      alert('Vui lòng nhập tên thuốc');
      return;
    }

    this.prescriptionsList.push({
      id: 'rx-' + Date.now(),
      medicationName: this.newDrug.medicationName,
      activeIngredient: this.newDrug.activeIngredient || 'Hoạt chất tổng hợp',
      dosage: this.newDrug.dosage,
      quantity: this.newDrug.quantity,
      unit: this.newDrug.unit,
      instructions: this.newDrug.instructions,
    });

    this.newDrug.medicationName = '';
    this.newDrug.activeIngredient = '';
  }

  handleRemoveDrug(id: string) {
    this.prescriptionsList = this.prescriptionsList.filter((d) => d.id !== id);
  }
}
