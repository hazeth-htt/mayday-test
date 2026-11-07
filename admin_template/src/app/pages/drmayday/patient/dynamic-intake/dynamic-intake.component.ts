import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { FormQuestion, FormTemplate } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-dynamic-intake',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dynamic-intake.component.html',
})
export class DynamicIntakeComponent {
  drmayday = inject(DrMayDayService);
  router = inject(Router);

  template: FormTemplate | undefined;
  // Patient answers model
  answers: Record<string, any> = {};
  isSubmitted = false;

  get recentRecordCode(): string {
    const records = this.drmayday.records();
    return records.length ? records[0].record_code : 'Hồ sơ khám điện tử';
  }

  ngOnInit() {
    // Load default template (Slide 11: tmpl03)
    this.template = this.drmayday.templates()[0];
    // Pre-populate some defaults
    this.answers['co_dau_hieu_phan_ve'] = 'no';
    this.answers['thoi_gian_mac_benh'] = 'over_6_weeks';
    this.answers['thoi_gian_ton_tai_san'] = 'under_24h';
    this.answers['co_phu_mach'] = 'no';
  }

  // Branching evaluation: Check if question should be shown
  shouldShowQuestion(question: FormQuestion): boolean {
    if (!question.parent_question_id || !question.show_if_answer) {
      return true; // Root question or unconditional
    }
    // Find parent question code
    const parentQuestion = this.findQuestionById(question.parent_question_id);
    if (!parentQuestion) return true;
    const parentAnswer = this.answers[parentQuestion.code];
    return parentAnswer === question.show_if_answer;
  }

  findQuestionById(id: string): FormQuestion | undefined {
    if (!this.template?.sections) return undefined;
    for (const sec of this.template.sections) {
      const q = sec.questions.find((item) => item.id === id);
      if (q) return q;
    }
    return undefined;
  }

  handleCheckboxChange(code: string, value: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const current = (this.answers[code] as string[]) || [];
    if (isChecked) {
      this.answers[code] = [...current, value];
    } else {
      this.answers[code] = current.filter((v) => v !== value);
    }
  }

  handleSubmitIntake() {
    this.isSubmitted = true;
    // Save to active medical record
    this.drmayday.saveRecordAnswers('rec-001', this.answers);
  }
}
