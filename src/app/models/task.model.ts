export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assignedUserId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inprogress',
  DONE = 'done'
}