export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Optional fields for when projects are fetched with related data
  tasks?: Array<{
    id: string;
    title: string;
    status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
    priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string | null;
  }>;
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
} 