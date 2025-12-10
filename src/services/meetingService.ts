import { apiClient } from '@/lib/api-client';
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
      // Use apiClient for proper authentication through proxy
      const response: any = await apiClient.get<Meeting[]>('/Meeting');
      
      console.log('Meeting API Response:', response);
      
      // Backend returns array directly (not wrapped in success/data)
      // The proxy just forwards it as-is
      if (Array.isArray(response)) {
        return response;
      }
      
      // If wrapped in data field
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // If wrapped in success object
      if (response.success && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Return empty array on failure
      return [];
    } catch (error: any) {
      console.error('Failed to fetch meetings:', error);
      // Return empty array instead of throwing to prevent redirect
      return [];
    }
  },

  /**
   * Lấy meeting theo ID
   * GET /Meeting/{id}
   */
  async getMeetingById(id: number): Promise<Meeting> {
    try {
      const response = await apiClient.get<Meeting>(`/Meeting/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch meeting');
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
      const response: any = await apiClient.post<Meeting>('/Meeting', data);
      
      console.log('Create Meeting Response:', response);
      
      // Check if response itself is the meeting object (backend returns directly)
      if (response && typeof response === 'object' && 'id' in response && 'title' in response) {
        return response as Meeting;
      }
      
      // Backend may return meeting object in data field
      if (response.data) {
        // Check if data is the meeting object itself
        if (typeof response.data === 'object' && 'id' in response.data) {
          return response.data as Meeting;
        }
      }
      
      // If wrapped in success
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create meeting');
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
      const response = await apiClient.put<null>(`/Meeting/${id}`, data);
      
      console.log('Update Meeting Response:', response);
      
      // PUT may return 204 No Content or 200 OK
      // Both are success cases
      return;
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
      const response = await apiClient.delete<null>(`/Meeting/${id}`);
      
      console.log('Delete Meeting Response:', response);
      
      // DELETE may return 204 No Content or 200 OK
      // Both are success cases
      return;
    } catch (error: any) {
      console.error(`Failed to delete meeting ${id}:`, error);
      throw error;
    }
  }
};
