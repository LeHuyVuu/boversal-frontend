export type ProjectStatus = 'active' | 'archived' | 'completed' | 'inactive';

export type Project = {
  id: number;
  ownerId: number;
  name: string;
  demoUrl: string | null;
  startDate: string;
  endDate: string | null;
  shortIntro: string;
  highlight: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListResponse = Project[];
