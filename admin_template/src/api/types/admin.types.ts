export interface BranchDto {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_active?: string | number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  phone: string;
}

export interface DepartmentDto {
  id: number;
  name: string;
  branch_id: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  branch_id: number;
  description?: string;
}

export interface RoomDto {
  id: number;
  name: string;
  department_id: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoomRequest {
  name: string;
  department_id: number;
  description?: string;
}

export interface RoleDto {
  id: number;
  name: string;
  description?: string;
  parent_role_id?: number | null;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  parent_role_id?: number | null;
}

export interface PermissionDto {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RolePermissionDto {
  role_permission_id: number;
  permission_id: number;
  name: string;
  description?: string;
  assigned_at?: string;
}

export interface AssignStaffRequest {
  branch_id: number;
  department_id: number;
  room_id?: number | null;
}

// Templates & Questions
export interface QuestionOptionDto {
  id: string | number;
  option_text: string;
  option_value: string;
  order?: number;
  trigger_image_upload?: string | number;
}

export interface QuestionDto {
  question_id: string;
  section_id?: string;
  question_text: string;
  type_question: 'text' | 'number' | 'radio' | 'checkbox' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  order?: number;
  is_required?: string | number | boolean;
  parent_question_id?: string | null;
  show_if_answer?: string | null;
  help_text?: string;
  allow_image?: string | number | boolean;
  options?: QuestionOptionDto[];
}

export interface SectionDto {
  section_id: string;
  template_id?: string;
  title: string;
  order: number;
  is_required?: string | number | boolean;
  filled_by?: 'patient' | 'doctor' | 'both';
  questions: QuestionDto[];
}

export interface TemplateDto {
  code_template: string;
  name: string;
  description?: string;
  version?: string;
  is_active?: string | number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateDetailDto extends TemplateDto {
  sections: SectionDto[];
}

export interface CreateTemplateRequest {
  code_template: string;
  name: string;
  description?: string;
  version?: string;
  is_active?: string | number;
}

export interface CreateSectionRequest {
  title: string;
  order: number;
  is_required?: string | number;
  filled_by?: 'patient' | 'doctor' | 'both';
}

export interface CreateQuestionRequest {
  question_id: string;
  question_text: string;
  type_question: string;
  placeholder?: string;
  order: number;
  is_required?: string | number;
  parent_question_id?: string | null;
  show_if_answer?: string | null;
  help_text?: string;
  allow_image?: string | number;
  options?: Array<{
    option_text: string;
    option_value: string;
    order: number;
    trigger_image_upload?: string | number;
  }>;
}
