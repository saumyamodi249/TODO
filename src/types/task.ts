export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
  path: string;
}

export interface CreateTaskDto {
  title: string;
}

export interface UpdateTaskDto {
  title?: string;
  isCompleted?: boolean;
}

export type TaskFilter = "all" | "active" | "completed";
