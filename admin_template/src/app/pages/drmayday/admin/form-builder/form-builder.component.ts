import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../../../api/services/admin/admin-api.service';
import {
  CreateQuestionRequest,
  CreateSectionRequest,
  CreateTemplateRequest,
  QuestionDto,
  SectionDto,
  TemplateDetailDto,
  TemplateDto,
} from '../../../../../api/types/admin.types';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-builder.component.html',
})
export class FormBuilderComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  templates: TemplateDto[] = [];
  selectedTemplate: TemplateDto | null = null;
  selectedTemplateDetail: TemplateDetailDto | null = null;
  selectedSection: SectionDto | null = null;
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  isLoading = false;

  // Modals
  showJsonModal = false;
  showCreateTemplateModal = false;
  showAddSectionModal = false;
  showAddQuestionModal = false;

  // Form Models
  newTemplate: CreateTemplateRequest = {
    code_template: '',
    name: '',
    description: '',
    version: '1.0',
    is_active: 1,
  };

  newSection: CreateSectionRequest = {
    title: '',
    order: 1,
    is_required: 1,
    filled_by: 'patient',
  };

  newQuestion = {
    question_id: '',
    question_text: '',
    type_question: 'radio',
    placeholder: '',
    is_required: 1,
    order: 1,
    optionsRaw: 'Có|yes\nKhông|no',
  };

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.isLoading = true;
    this.adminApi.getTemplates().subscribe({
      next: (list) => {
        this.templates = list;
        if (list.length > 0) {
          this.selectTemplate(list[0]);
        } else {
          this.isLoading = false;
        }
      },
      error: () => (this.isLoading = false),
    });
  }

  selectTemplate(tmpl: TemplateDto) {
    this.selectedTemplate = tmpl;
    this.isLoading = true;
    this.adminApi.getTemplateDetail(tmpl.code_template).subscribe({
      next: (detail) => {
        this.selectedTemplateDetail = detail;
        this.selectedSection = detail.sections?.[0] || null;
        this.isLoading = false;
      },
      error: () => {
        // Fallback detail
        this.selectedTemplateDetail = { ...tmpl, sections: [] };
        this.selectedSection = null;
        this.isLoading = false;
      },
    });
  }

  selectSection(sec: SectionDto) {
    this.selectedSection = sec;
  }

  showAlert(text: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleCreateTemplate() {
    if (!this.newTemplate.code_template || !this.newTemplate.name) {
      this.showAlert('Vui lòng nhập mã và tên mẫu phiếu!', 'error');
      return;
    }

    this.adminApi.createTemplate(this.newTemplate).subscribe({
      next: (tmpl) => {
        this.templates.push(tmpl);
        this.selectTemplate(tmpl);
        this.newTemplate = { code_template: '', name: '', description: '', version: '1.0', is_active: 1 };
        this.showCreateTemplateModal = false;
        this.showAlert('Đã tạo mẫu phiếu khám mới thành công!', 'success');
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  handleAddSection() {
    if (!this.selectedTemplate) return;
    if (!this.newSection.title) {
      this.showAlert('Vui lòng nhập tiêu đề phân mục!', 'error');
      return;
    }

    const payload: CreateSectionRequest = {
      title: this.newSection.title,
      order: (this.selectedTemplateDetail?.sections?.length || 0) + 1,
      is_required: 1,
      filled_by: this.newSection.filled_by || 'patient',
    };

    this.adminApi.createSection(this.selectedTemplate.code_template, payload).subscribe({
      next: (sec) => {
        if (this.selectedTemplateDetail) {
          if (!this.selectedTemplateDetail.sections) this.selectedTemplateDetail.sections = [];
          this.selectedTemplateDetail.sections.push(sec);
          this.selectedSection = sec;
        }
        this.newSection = { title: '', order: 1, is_required: 1, filled_by: 'patient' };
        this.showAddSectionModal = false;
        this.showAlert('Đã tạo phân mục mới thành công!', 'success');
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  openAddQuestionModal() {
    const qCount = this.selectedSection?.questions?.length || 0;
    this.newQuestion = {
      question_id: `Q_${Date.now().toString().slice(-4)}`,
      question_text: '',
      type_question: 'radio',
      placeholder: '',
      is_required: 1,
      order: qCount + 1,
      optionsRaw: 'Có|yes\nKhông|no',
    };
    this.showAddQuestionModal = true;
  }

  handleAddQuestion() {
    if (!this.selectedSection) return;
    if (!this.newQuestion.question_id || !this.newQuestion.question_text) {
      this.showAlert('Vui lòng nhập mã và nội dung câu hỏi!', 'error');
      return;
    }

    const options = ['radio', 'checkbox', 'select'].includes(this.newQuestion.type_question)
      ? this.newQuestion.optionsRaw
          .split('\n')
          .filter((line) => line.trim())
          .map((line, idx) => {
            const parts = line.split('|');
            return {
              option_text: parts[0]?.trim() || '',
              option_value: parts[1]?.trim() || parts[0]?.trim() || '',
              order: idx + 1,
            };
          })
      : [];

    const payload: CreateQuestionRequest = {
      question_id: this.newQuestion.question_id,
      question_text: this.newQuestion.question_text,
      type_question: this.newQuestion.type_question,
      placeholder: this.newQuestion.placeholder,
      order: this.newQuestion.order,
      is_required: this.newQuestion.is_required,
      options,
    };

    this.adminApi.createQuestion(this.selectedSection.section_id, payload).subscribe({
      next: () => {
        const newQ: QuestionDto = {
          question_id: payload.question_id,
          section_id: this.selectedSection!.section_id,
          question_text: payload.question_text,
          type_question: payload.type_question as any,
          placeholder: payload.placeholder,
          order: payload.order,
          is_required: payload.is_required,
          options: payload.options?.map((o, idx) => ({
            id: idx + 1,
            option_text: o.option_text,
            option_value: o.option_value,
            order: o.order,
          })),
        };
        if (!this.selectedSection!.questions) this.selectedSection!.questions = [];
        this.selectedSection!.questions.push(newQ);
        this.showAddQuestionModal = false;
        this.showAlert('Đã thêm câu hỏi vào phân mục thành công!', 'success');
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  getJsonExport(): string {
    return JSON.stringify(this.selectedTemplateDetail || this.selectedTemplate, null, 2);
  }

  getFilledByLabel(filledBy?: string): string {
    switch (filledBy) {
      case 'doctor':
        return 'Bác sĩ điền';
      case 'both':
        return 'Bác sĩ & Bệnh nhân';
      default:
        return 'Bệnh nhân tự khai';
    }
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case 'radio':
        return 'Chọn 1 (Radio)';
      case 'checkbox':
        return 'Chọn nhiều (Checkbox)';
      case 'textarea':
        return 'Đoạn văn';
      case 'number':
        return 'Số lượng';
      default:
        return 'Văn bản ngắn';
    }
  }
}
