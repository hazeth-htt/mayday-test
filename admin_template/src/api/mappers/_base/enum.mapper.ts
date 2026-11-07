import { CLINICAL_LABELS } from '../../../app/core/constants/content-dictionary';

export function mapRoleToLabel(role: string): string {
  const normalized = role.toLowerCase().replace('role_', '') as keyof typeof CLINICAL_LABELS.roles;
  return CLINICAL_LABELS.roles[normalized]?.label || role;
}

export function mapStatusToLabel(status: string): string {
  const s = status.toLowerCase();
  switch (s) {
    case 'pending':
      return 'Chờ tiếp nhận';
    case 'in_progress':
      return 'Đang thăm khám';
    case 'completed':
      return 'Đã hoàn thành';
    case 'cancelled':
      return 'Đã hủy ca';
    default:
      return status;
  }
}

export function mapMilestoneToLabel(milestone: string): string {
  const m = milestone.toLowerCase() as keyof typeof CLINICAL_LABELS.lesions.milestones;
  return CLINICAL_LABELS.lesions.milestones[m] || milestone;
}

export function mapUas7SeverityToLabel(severity: string | number): string {
  if (typeof severity === 'number') {
    if (severity <= 6) return 'Kiểm soát tốt (0 - 6)';
    if (severity <= 15) return 'Mức độ nhẹ (7 - 15)';
    if (severity <= 27) return 'Mức độ vừa (16 - 27)';
    return 'Mức độ nặng (28 - 42)';
  }
  return String(severity);
}

export function mapQuestionTypeToLabel(type: string): string {
  const t = type.toLowerCase() as keyof typeof CLINICAL_LABELS.formBuilder.questionTypes;
  return CLINICAL_LABELS.formBuilder.questionTypes[t] || type;
}

export function mapFilledByToLabel(filledBy: string): string {
  const f = filledBy.toLowerCase() as keyof typeof CLINICAL_LABELS.formBuilder.filledBy;
  return CLINICAL_LABELS.formBuilder.filledBy[f] || filledBy;
}
