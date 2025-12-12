import { apiClient } from '@/lib/api-client';

export interface ReminderDto {
  id: string;
  userId: number;
  title: string;
  note: string | null;
  reminderTime: string; // ISO 8601 UTC
  isEmailSent: boolean;
  emailSentAt: string | null;
  isExpired: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateReminderRequest {
  title: string;
  note?: string;
  reminderTime: string; // ISO 8601 UTC
}

export interface UpdateReminderRequest {
  title: string;
  note?: string;
  reminderTime: string; // ISO 8601 UTC
  isCompleted: boolean;
}

export const reminderService = {
  /**
   * Lấy danh sách reminders
   * @param includeExpired - Có lấy reminders đã hết hạn không
   * @param includeCompleted - Có lấy reminders đã hoàn thành không
   */
  async getReminders(includeExpired = false, includeCompleted = false): Promise<ReminderDto[]> {
    const params = new URLSearchParams();
    if (includeExpired) params.append('includeExpired', 'true');
    if (includeCompleted) params.append('includeCompleted', 'true');

    const queryString = params.toString();
    const url = `/Reminder${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ReminderDto[]>(url);
    
    // Handle both wrapped and direct array responses
    if (Array.isArray(response)) {
      return response;
    }
    if (response.success && response.data) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  },

  /**
   * Lấy chi tiết 1 reminder
   */
  async getReminder(id: string): Promise<ReminderDto> {
    const response = await apiClient.get<ReminderDto>(`/Reminder/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    if (response.id) {
      return response;
    }
    
    throw new Error('Reminder not found');
  },

  /**
   * Tạo reminder mới
   * @param data - Dữ liệu reminder (reminderTime phải là UTC)
   */
  async createReminder(data: CreateReminderRequest): Promise<ReminderDto> {
    console.log('Creating reminder with data:', data);
    const response = await apiClient.post<ReminderDto>('/Reminder', data);
    console.log('Create reminder response:', response);
    
    if (response.success && response.data) {
      return response.data;
    }
    if (response.data && response.data.id) {
      return response.data;
    }
    // Check if response itself is the reminder object
    if (response && (response as any).id) {
      return response as any as ReminderDto;
    }
    
    throw new Error((response as any).message || 'Failed to create reminder');
  },

  /**
   * Cập nhật reminder
   * @param id - ID của reminder
   * @param data - Dữ liệu cập nhật
   */
  async updateReminder(id: string, data: UpdateReminderRequest): Promise<ReminderDto> {
    const response = await apiClient.put<ReminderDto>(`/Reminder/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    if (response.id) {
      return response;
    }
    
    throw new Error(response.message || 'Failed to update reminder');
  },

  /**
   * Xóa reminder
   */
  async deleteReminder(id: string): Promise<void> {
    await apiClient.delete<void>(`/Reminder/${id}`);
  }
};

/**
 * Helper: Convert local Date to UTC ISO string
 * Example: Local 11:25 → "2025-12-12T04:25:00.000Z"
 */
export function localToUTC(localDate: Date): string {
  return localDate.toISOString();
}

/**
 * Helper: Convert UTC ISO string to local Date
 * Example: "2025-12-12T04:25:00.000Z" → Local Date object
 */
export function utcToLocal(utcString: string): Date {
  return new Date(utcString);
}

/**
 * Helper: Format date for display
 */
export function formatLocalDateTime(utcString: string): string {
  const local = utcToLocal(utcString);
  return local.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
