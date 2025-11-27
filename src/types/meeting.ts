export interface Meeting {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  userId: number;
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingDto {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  attendees: string[];
}

export interface UpdateMeetingDto {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  attendees: string[];
}
