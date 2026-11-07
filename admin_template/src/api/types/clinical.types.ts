export interface PrescriptionItemPayload {
  medicine_name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instruction?: string;
}

export interface PrescriptionItemDto extends PrescriptionItemPayload {
  prescription_item_id: string;
  created_at: string;
}

export interface CreatePrescriptionRequest {
  medical_record_id: number;
  note?: string;
  items: PrescriptionItemPayload[];
}

export interface PrescriptionDto {
  prescription_id: string;
  medical_record_id: number;
  created_by: number;
  note?: string | null;
  items: PrescriptionItemDto[];
  created_at: string;
}

export interface LabItemPayload {
  test_name: string;
  description?: string;
}

export interface LabItemDto extends LabItemPayload {
  id: string;
  result_id?: string | null;
  result_value?: string | null;
  concluded_by?: number | null;
  result_note?: string | null;
  created_at: string;
}

export interface CreateLabRequest {
  medical_record_id: number;
  note?: string;
  items: LabItemPayload[];
}

export interface LabRequestDto {
  id: string;
  medical_record_id: number;
  requested_by: number;
  status: 'pending' | 'in_progress' | 'completed';
  note?: string | null;
  items: LabItemDto[];
  created_at: string;
}
