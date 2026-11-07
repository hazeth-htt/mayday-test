import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import {
  FilledByRole,
  FormQuestion,
  FormSection,
  FormTemplate,
  QuestionType,
} from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-builder.component.html',
})
export class FormBuilderComponent {
  drmayday = inject(DrMayDayService);

  selectedTemplate: FormTemplate | null = null;
  selectedSection: FormSection | null = null;
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // View raw json (tmpl03)
  showJsonModal = false;

  // Modals
  showCreateTemplateModal = false;
  showAddSectionModal = false;
  showAddQuestionModal = false;

  // Form Models
  newTemplate = {
    code_template: '',
    name: '',
    disease_category: 'chronic_urticaria' as const,
    description: '',
    is_active: true,
  };

  newSection = {
    title: '',
    description: '',
    filled_by: 'patient' as FilledByRole,
    order_index: 1,
  };

  newQuestion = {
    code: '',
    question_text: '',
    question_type: 'radio' as QuestionType,
    placeholder: '',
    is_required: true,
    parent_question_id: null as string | null,
    show_if_answer: null as string | null,
    order_index: 1,
    optionsRaw: 'Có|yes\nKhông|no',
  };

  getFilledByLabel(role: FilledByRole): string {
    switch (role) {
      case 'patient': return 'Bệnh nhân tự khai';
      case 'doctor': return 'Bác sĩ thăm khám';
      case 'both': return 'Cả hai cùng điền';
      default: return role;
    }
  }

  getQuestionTypeLabel(type: QuestionType): string {
    switch (type) {
      case 'radio': return 'Chọn 1';
      case 'checkbox': return 'Chọn nhiều';
      case 'text': return 'Văn bản ngắn';
      case 'textarea': return 'Đoạn văn';
      case 'number': return 'Số lượng';
      default: return type;
    }
  }

  ngOnInit() {
    this.selectedTemplate = this.drmayday.templates()[0] || null;
    this.selectedSection = this.selectedTemplate?.sections?.[0] || null;
  }

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  selectTemplate(tmpl: FormTemplate) {
    this.selectedTemplate = tmpl;
    this.selectedSection = tmpl.sections?.[0] || null;
  }

  selectSection(sec: FormSection) {
    this.selectedSection = sec;
  }

  // Template actions
  handleCreateTemplate() {
    if (!this.newTemplate.code_template || !this.newTemplate.name) {
      this.showAlert('Vui lòng nhập mã và tên mẫu phiếu!', 'error');
      return;
    }
    const res = this.drmayday.createTemplate(this.newTemplate);
    this.selectedTemplate = res.data;
    this.newTemplate = { code_template: '', name: '', disease_category: 'chronic_urticaria', description: '', is_active: true };
    this.showCreateTemplateModal = false;
    this.showAlert('Đã tạo mẫu phiếu thành công!', 'success');
  }

  handleDeleteTemplate(templateId: string) {
    if (!confirm('Bạn có chắc muốn xóa mẫu phiếu này?')) return;
    const res = this.drmayday.deleteTemplate(templateId);
    if (res.error) {
      this.showAlert(res.error, 'error');
    } else {
      this.selectedTemplate = this.drmayday.templates()[0] || null;
      this.selectedSection = this.selectedTemplate?.sections?.[0] || null;
      this.showAlert(res.message || '', 'success');
    }
  }

  // Section actions
  handleAddSection() {
    if (!this.selectedTemplate) return;
    if (!this.newSection.title) {
      this.showAlert('Vui lòng nhập tiêu đề phân mục!', 'error');
      return;
    }
    const res = this.drmayday.addSectionToTemplate(this.selectedTemplate.id, this.newSection);
    // Refresh selected template
    this.selectedTemplate = this.drmayday.getTemplateTree(this.selectedTemplate.id) || null;
    this.selectedSection = res.data;
    this.newSection = { title: '', description: '', filled_by: 'patient', order_index: (this.selectedTemplate?.sections?.length || 0) + 1 };
    this.showAddSectionModal = false;
    this.showAlert(res.message, 'success');
  }

  handleDeleteSection(sectionId: string) {
    if (!this.selectedTemplate) return;
    if (!confirm('Cảnh báo: Xóa mục này sẽ đồng thời xóa toàn bộ các câu hỏi bên trong. Bạn có chắc chắn muốn xóa?')) return;
    const res = this.drmayday.deleteSection(this.selectedTemplate.id, sectionId);
    this.selectedTemplate = this.drmayday.getTemplateTree(this.selectedTemplate.id) || null;
    this.selectedSection = this.selectedTemplate?.sections?.[0] || null;
    this.showAlert(res.message, 'success');
  }

  // Question actions
  openAddQuestionModal() {
    this.newQuestion = {
      code: '',
      question_text: '',
      question_type: 'radio',
      placeholder: '',
      is_required: true,
      parent_question_id: null,
      show_if_answer: null,
      order_index: (this.selectedSection?.questions?.length || 0) + 1,
      optionsRaw: 'Có|yes\nKhông|no',
    };
    this.showAddQuestionModal = true;
  }

  handleAddQuestion() {
    if (!this.selectedTemplate || !this.selectedSection) return;
    if (!this.newQuestion.code || !this.newQuestion.question_text) {
      this.showAlert('Vui lòng nhập mã và nội dung câu hỏi!', 'error');
      return;
    }

    // Parse options if radio, checkbox, select
    const options = ['radio', 'checkbox', 'select'].includes(this.newQuestion.question_type)
      ? this.newQuestion.optionsRaw
          .split('\n')
          .filter((line) => line.trim())
          .map((line, idx) => {
            const parts = line.split('|');
            return {
              id: `opt-${Date.now()}-${idx}`,
              question_id: '',
              label: parts[0]?.trim() || '',
              value: parts[1]?.trim() || parts[0]?.trim() || '',
            };
          })
      : [];

    const res = this.drmayday.addQuestionToSection(
      this.selectedTemplate.id,
      this.selectedSection.id,
      {
        code: this.newQuestion.code,
        question_text: this.newQuestion.question_text,
        question_type: this.newQuestion.question_type,
        placeholder: this.newQuestion.placeholder,
        is_required: this.newQuestion.is_required,
        parent_question_id: this.newQuestion.parent_question_id || null,
        show_if_answer: this.newQuestion.show_if_answer || null,
        order_index: this.newQuestion.order_index,
        options,
      }
    );

    this.selectedTemplate = this.drmayday.getTemplateTree(this.selectedTemplate.id) || null;
    this.selectedSection = this.selectedTemplate?.sections?.find((s) => s.id === this.selectedSection?.id) || null;
    this.showAddQuestionModal = false;
    this.showAlert(res.message, 'success');
  }

  handleDeleteQuestion(questionId: string) {
    if (!this.selectedTemplate || !this.selectedSection) return;
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    const res = this.drmayday.deleteQuestion(this.selectedTemplate.id, this.selectedSection.id, questionId);
    this.selectedTemplate = this.drmayday.getTemplateTree(this.selectedTemplate.id) || null;
    this.selectedSection = this.selectedTemplate?.sections?.find((s) => s.id === this.selectedSection?.id) || null;
    this.showAlert(res.message, 'success');
  }

  getJsonExport() {
    return JSON.stringify(this.selectedTemplate, null, 2);
  }
}
