import { User } from './user';

export interface Issue {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Bug' | 'Feature' | 'Task' | 'Story';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignee: User;
  reporter: User;
  createdAt: string;
  updatedAt: string;
  labels: string[];
}
