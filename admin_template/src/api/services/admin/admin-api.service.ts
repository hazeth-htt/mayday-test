import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../client/api-client';
import {
  AssignStaffRequest,
  BranchDto,
  CreateBranchRequest,
  CreateDepartmentRequest,
  CreateQuestionRequest,
  CreateRoleRequest,
  CreateRoomRequest,
  CreateSectionRequest,
  CreateTemplateRequest,
  DepartmentDto,
  PermissionDto,
  RoleDto,
  RolePermissionDto,
  RoomDto,
  SectionDto,
  TemplateDetailDto,
  TemplateDto,
} from '../../types/admin.types';
import {
  AuthUserInfo,
  CreateStaffRequest,
  SignupRequest,
  UserProfileDto,
} from '../../types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private api = inject(ApiClient);

  // 1. Topology: Branches
  getBranches(): Observable<BranchDto[]> {
    return this.api.get<BranchDto[]>('/branches');
  }

  createBranch(payload: CreateBranchRequest): Observable<BranchDto> {
    return this.api.post<BranchDto>('/branches', payload);
  }

  updateBranch(id: number, payload: Partial<CreateBranchRequest>): Observable<BranchDto> {
    return this.api.put<BranchDto>(`/branches/${id}`, payload);
  }

  deleteBranch(id: number): Observable<void> {
    return this.api.delete<void>(`/branches/${id}`);
  }

  // 2. Topology: Departments
  getDepartments(branchId?: number): Observable<DepartmentDto[]> {
    const params = branchId ? { branch_id: branchId } : undefined;
    return this.api.get<DepartmentDto[]>('/departments', params ? { params } : undefined);
  }

  createDepartment(payload: CreateDepartmentRequest): Observable<DepartmentDto> {
    return this.api.post<DepartmentDto>('/departments', payload);
  }

  updateDepartment(id: number, payload: Partial<CreateDepartmentRequest>): Observable<DepartmentDto> {
    return this.api.put<DepartmentDto>(`/departments/${id}`, payload);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.api.delete<void>(`/departments/${id}`);
  }

  // 3. Topology: Rooms
  getRooms(departmentId?: number): Observable<RoomDto[]> {
    const params = departmentId ? { department_id: departmentId } : undefined;
    return this.api.get<RoomDto[]>('/rooms', params ? { params } : undefined);
  }

  createRoom(payload: CreateRoomRequest): Observable<RoomDto> {
    return this.api.post<RoomDto>('/rooms', payload);
  }

  updateRoom(id: number, payload: Partial<CreateRoomRequest>): Observable<RoomDto> {
    return this.api.put<RoomDto>(`/rooms/${id}`, payload);
  }

  deleteRoom(id: number): Observable<void> {
    return this.api.delete<void>(`/rooms/${id}`);
  }

  // 4. Users & Staff Management
  getUsers(params?: { role_id?: number; search?: string }): Observable<AuthUserInfo[]> {
    return this.api.get<AuthUserInfo[]>('/users', params ? { params } : undefined);
  }

  getUserProfile(userId: number): Observable<UserProfileDto> {
    return this.api.get<UserProfileDto>(`/users/${userId}`);
  }

  createUser(payload: SignupRequest): Observable<AuthUserInfo> {
    return this.api.post<AuthUserInfo>('/users', payload);
  }

  createStaff(payload: CreateStaffRequest): Observable<AuthUserInfo> {
    return this.api.post<AuthUserInfo>('/staff', payload);
  }

  assignStaff(staffId: number, payload: AssignStaffRequest): Observable<void> {
    return this.api.post<void>(`/staff/${staffId}/assign`, payload);
  }

  // 5. RBAC (Roles & Permissions)
  getRoles(): Observable<RoleDto[]> {
    return this.api.get<RoleDto[]>('/roles');
  }

  createRole(payload: CreateRoleRequest): Observable<RoleDto> {
    return this.api.post<RoleDto>('/roles', payload);
  }

  getPermissions(): Observable<PermissionDto[]> {
    return this.api.get<PermissionDto[]>('/permissions');
  }

  getRolePermissions(roleId: number): Observable<RolePermissionDto[]> {
    return this.api.get<RolePermissionDto[]>(`/roles/${roleId}/permissions`);
  }

  assignRolePermissions(roleId: number, permissionIds: number[]): Observable<void> {
    return this.api.post<void>(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
  }

  removeRolePermission(roleId: number, permissionId: number): Observable<void> {
    return this.api.delete<void>(`/roles/${roleId}/permissions/${permissionId}`);
  }

  // 6. Form Templates
  getTemplates(): Observable<TemplateDto[]> {
    return this.api.get<TemplateDto[]>('/templates');
  }

  getTemplateDetail(code: string): Observable<TemplateDetailDto> {
    return this.api.get<TemplateDetailDto>(`/templates/${code}`);
  }

  createTemplate(payload: CreateTemplateRequest): Observable<TemplateDto> {
    return this.api.post<TemplateDto>('/templates', payload);
  }

  createSection(templateCode: string, payload: CreateSectionRequest): Observable<SectionDto> {
    return this.api.post<SectionDto>(`/templates/${templateCode}/sections`, payload);
  }

  createQuestion(sectionId: string, payload: CreateQuestionRequest): Observable<void> {
    return this.api.post<void>(`/sections/${sectionId}/questions`, payload);
  }
}
