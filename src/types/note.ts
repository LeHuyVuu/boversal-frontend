export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPinned?: boolean;
  color?: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}
