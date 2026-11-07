import {
  ROLE_LABELS,
  RECORD_STATUS_LABELS,
  MILESTONE_LABELS,
  UAS7_SEVERITY_LABELS,
  QUESTION_TYPE_LABELS,
  FILLED_BY_LABELS,
} from '../../../app/core/constants/content-dictionary';

export function mapRoleToLabel(role: string): string {
  const normalized = role.toLowerCase().replace('role_', '');
  return ROLE_LABELS[normalized as keyof typeof ROLE_LABELS] || role;
}

export function mapStatusToLabel(status: string): string {
  const normalized = status.toLowerCase();
  return RECORD_STATUS_LABELS[normalized as keyof typeof RECORD_STATUS_LABELS] || status;
}

export function mapMilestoneToLabel(milestone: string): string {
  const normalized = milestone.toLowerCase();
  return MILESTONE_LABELS[normalized as keyof typeof MILESTONE_LABELS] || milestone;
}

export function mapUas7SeverityToLabel(severity: string | number): string {
  if (typeof severity === 'number') {
    if (severity <= 6) return UAS7_SEVERITY_LABELS.remission;
    if (severity <= 15) return UAS7_SEVERITY_LABELS.mild;
    if (severity <= 27) return UAS7_SEVERITY_LABELS.moderate;
    return UAS7_SEVERITY_LABELS.severe;
  }
  const key = severity.toLowerCase();
  return UAS7_SEVERITY_LABELS[key as keyof typeof UAS7_SEVERITY_LABELS] || severity;
}

export function mapQuestionTypeToLabel(type: string): string {
  return QUESTION_TYPE_LABELS[type as keyof typeof QUESTION_TYPE_LABELS] || type;
}

export function mapFilledByToLabel(filledBy: string): string {
  return FILLED_BY_LABELS[filledBy as keyof typeof FILLED_BY_LABELS] || filledBy;
}
