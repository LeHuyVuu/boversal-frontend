import { User } from './user';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'review';
  date: string;
  startTime: string;
  endTime: string;
  attendees: User[];
  project?: string;
}
