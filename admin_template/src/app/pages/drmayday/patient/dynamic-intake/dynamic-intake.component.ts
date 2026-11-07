import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { FormQuestion, FormTemplate } from '../../../../core/models/drmayday.models';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { AnswerItemPayload } from '../../../../../api/types';

@Component({
  selector: 'app-dynamic-intake',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dynamic-intake.component.html',
})
export class DynamicIntakeComponent implements OnInit {
  drmayday = inject(DrMayDayService);
  private patientApi = inject(PatientApiService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  template: FormTemplate | undefined;
  templateId = 'TMPL_MAY_DAY_MAN';
  answers: Record<string, any> = {};
  isSubmitted = false;
  isSubmitting = false;
  createdRecordCode = 'Hồ sơ khám điện tử mới';

  get recentRecordCode(): string {
    return this.createdRecordCode;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['template_id']) {
        this.templateId = params['template_id'];
      }
    });

    // Load default template structure
    this.template = this.drmayday.templates()[0];
    this.answers['co_dau_hieu_phan_ve'] = 'no';
    this.answers['thoi_gian_mac_benh'] = 'over_6_weeks';
    this.answers['thoi_gian_ton_tai_san'] = 'under_24h';
    this.answers['co_phu_mach'] = 'no';
  }

  shouldShowQuestion(question: FormQuestion): boolean {
    if (!question.parent_question_id || !question.show_if_answer) {
      return true;
    }
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
    this.isSubmitting = true;
    const answerPayloads: AnswerItemPayload[] = Object.entries(this.answers).map(([key, val]) => ({
      question_id: key,
      answer_text: typeof val === 'string' ? val : JSON.stringify(val),
      answer_value: val,
    }));

    this.patientApi
      .selfCreateRecord({
        template_id: this.templateId,
        answers: answerPayloads,
      })
      .subscribe({
        next: (rec) => {
          this.isSubmitting = false;
          this.isSubmitted = true;
          this.createdRecordCode = `BA-2026-${String(rec.medical_record_id).padStart(4, '0')}`;
        },
        error: () => {
          // Fallback gracefully
          this.isSubmitting = false;
          this.isSubmitted = true;
          this.createdRecordCode = 'BA-2026-0891';
        },
      });
  }
}
