# HỢP ĐỒNG KỸ THUẬT TẦNG NỀN TẢNG (FOUNDATION CONTRACT)
**Dự án:** Hệ thống Quản trị & Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn:** Bệnh viện Da liễu Trung ương  
**Agent ban hành:** `foundation`  
**Nhánh git:** `agent/foundation`  
**Ngày ban hành:** 08/11/2026  
**Áp dụng bắt buộc cho:** Các agent Giao diện (`shared-fe`, `patient-fe`, `doctor-fe`, `admin-fe`) ở Giai đoạn 3  

---

## 1. TỔNG QUAN KIẾN TRÚC ĐÃ TRIỂN KHAI

Tầng nền tảng Foundation đã hoàn tất 100% các thành phần cốt lõi:
1. **TypeScript Types (`src/api/types/`):**
   - Không dùng `any`. Định nghĩa đầy đủ các interface Request, Response, DTO theo spec cho Auth, Medical Records, UAS7, Lesions, Prescriptions, Labs, Topology, RBAC, Notifications.
2. **Core API Client (`src/api/client/api-client.ts`):**
   - Injectable Service `ApiClient` bọc trên `HttpClient` của Angular.
   - Base URL lấy từ `environment.apiUrl`.
   - Tự động gắn header `Authorization: Bearer <token>` từ `localStorage.getItem('drmayday_token')`.
   - Tự động bóc tách envelope `{ code: "1000", message: "OK", data: T }`.
   - Bắt lỗi HTTP và chuyển đổi thành instance của `AppError`.
   - Tự động xử lý lỗi 401: Xóa token và chuyển hướng về `/login`.
3. **Mappers Nền Tảng (`src/api/mappers/_base/`):**
   - `formatDateToDisplay`: Chuyển ISO string ➔ `DD/MM/YYYY`.
   - `formatDateTimeToDisplay`: Chuyển ISO string ➔ `HH:mm, DD/MM/YYYY`.
   - `toNumericId` / `toStringId`: Chuyển đổi an toàn ID giữa frontend và backend.
   - `mapRoleToLabel`, `mapStatusToLabel`, `mapMilestoneToLabel`, `mapUas7SeverityToLabel`: Ánh xạ enum sang tiếng Việt từ `content-dictionary.ts`.
4. **Hạ Tầng Mock (`src/mocks/_base/`):**
   - Stateful In-memory Database `mockDb` lưu trữ dữ liệu giả lập chuẩn y tế.
   - `mockHttpInterceptor` tự động chặn mọi request `/api/*` khi `environment.useMock === true`, mô phỏng delay mạng 250ms và trả về đúng envelope chuẩn.
   - Đã đăng ký `provideHttpClient(withInterceptors([mockHttpInterceptor]))` tại `app.config.ts`.

---

## 2. QUY CHUẨN DÀNH CHO CÁC AGENT GIAO DIỆN (GIAI ĐOẠN 3)

### 2.1. Quy tắc gọi API
* **Tuyệt đối không gọi `fetch` hay `HttpClient` trực tiếp từ Component.**
* Mọi component giao diện phải gọi qua **Service chuyên biệt** của từng phân hệ:
  * `patient-fe` ➔ `src/api/services/patient/...`
  * `doctor-fe` ➔ `src/api/services/doctor/...`
  * `admin-fe` ➔ `src/api/services/admin/...`
  * `shared-fe` ➔ `src/api/services/auth/...`
* Trong các Service, inject `ApiClient` để gọi:
```typescript
import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../../client/api-client';
import { Uas7ScoreDto, CreateUas7ScoreRequest } from '../../types';

@Injectable({ providedIn: 'root' })
export class PatientUas7Service {
  private api = inject(ApiClient);

  getScores(patientId: number) {
    return this.api.get<Uas7ScoreDto[]>(`uas7scores/patient/${patientId}`);
  }

  submitScore(payload: CreateUas7ScoreRequest) {
    return this.api.post<Uas7ScoreDto[]>('uas7scores', payload);
  }
}
```

### 2.2. Quy tắc xử lý lỗi với `AppError`
Mọi service hoặc component khi `catchError` hoặc bắt lỗi trong subscription cần kiểm tra `AppError`:
```typescript
this.patientService.submitScore(data).subscribe({
  next: (res) => {
    this.showAlert('Đã ghi nhận điểm thành công!', 'success');
  },
  error: (err: AppError) => {
    if (err.isDuplicate()) {
      this.dateFieldError = err.message; // "Bạn đã ghi nhận điểm cho ngày này rồi."
    } else if (err.isValidation()) {
      this.showAlert(err.message, 'error');
    } else {
      this.showAlert(err.message, 'error');
    }
  }
});
```

### 2.3. Quy tắc giao diện & trạng thái (UI States)
Mỗi màn hình bắt buộc phải có đầy đủ 4 trạng thái:
1. **Loading State:** Khi đang tải dữ liệu (`isLoading = true`), hiển thị skeleton placeholder (không để màn hình trắng hay giật layout).
2. **Empty State:** Khi mảng trả về rỗng (`items.length === 0`), hiển thị thông báo thân thiện (ví dụ: *"Chưa có ca khám nào đang chờ"* kèm icon Iconsax).
3. **Error State:** Khi API bị lỗi, hiển thị thông báo tiếng Việt lịch sự kèm nút "Thử lại" (Retry).
4. **Submitting / Debounce:** Khi bấm nút submit, đặt cờ `isSubmitting = true` và `disabled` nút bấm để chống double-click.

### 2.4. Quy tắc Mock dữ liệu (Đối với điểm lệch Loại B)
* Nếu màn hình cần dữ liệu mà backend chưa có API trong spec (Điểm lệch Loại B), **KHÔNG bịa endpoint mới**.
* Khai báo hàm trong service với comment rõ ràng: `// [TEMPORARY MOCK - GAP-B-XX]` và trả về dữ liệu giả lập từ `mockDb`.
