import axios from '@/lib/axios-config';
import type { Meeting, CreateMeetingDto, UpdateMeetingDto } from '@/types/meeting';

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export const meetingService = {
  /**
   * Lấy tất cả meetings của user hiện tại
   * GET /Meeting
   */
  async getMeetings(): Promise<Meeting[]> {
    try {
      // Backend trả về array trực tiếp, không có wrapper
      const response = await axios.get<Meeting[]>('/Meeting');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch meetings:', error);
      throw error;
    }
  },

  /**
   * Lấy meeting theo ID
   * GET /Meeting/{id}
   */
  async getMeetingById(id: number): Promise<Meeting> {
    try {
      const response = await axios.get<Meeting>(`/Meeting/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch meeting ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo meeting mới
   * POST /Meeting
   * Tự động gửi email invitation cho tất cả attendees
   */
  async createMeeting(data: CreateMeetingDto): Promise<Meeting> {
    try {
      const response = await axios.post<Meeting>('/Meeting', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create meeting:', error);
      throw error;
    }
  },

  /**
   * Cập nhật meeting
   * PUT /Meeting/{id}
   * Returns 204 No Content on success
   */
  async updateMeeting(id: number, data: UpdateMeetingDto): Promise<void> {
    try {
      await axios.put(`/Meeting/${id}`, data);
    } catch (error: any) {
      console.error(`Failed to update meeting ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa meeting (soft delete)
   * DELETE /Meeting/{id}
   * Returns 204 No Content on success
   */
  async deleteMeeting(id: number): Promise<void> {
    try {
      await axios.delete(`/Meeting/${id}`);
    } catch (error: any) {
      console.error(`Failed to delete meeting ${id}:`, error);
      throw error;
    }
  }
};
