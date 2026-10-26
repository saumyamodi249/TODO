import { axiosClient } from "./axiosClient";
import type {
  ApiResponse,
  CreateTaskDto,
  Task,
  UpdateTaskDto,
} from "@/types/task";

export const taskApi = {
  async getAllTasks(): Promise<Task[]> {
    const response = await axiosClient.get<ApiResponse<Task[]>>("/tasks");
    return response.data.data ?? [];
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await axiosClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.data) {
      throw new Error("Task not found");
    }
    return response.data.data;
  },

  async createTask(dto: CreateTaskDto): Promise<Task> {
    // Only send title as per API specification
    const payload = { title: dto.title.trim() };
    const response = await axiosClient.post<ApiResponse<Task>>("/tasks", payload);
    if (!response.data.data) {
      throw new Error("Failed to create task");
    }
    return response.data.data;
  },

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    // Only send title and/or isCompleted as per API specification
    const payload: UpdateTaskDto = {};
    if (dto.title !== undefined) {
      payload.title = dto.title.trim();
    }
    if (dto.isCompleted !== undefined) {
      payload.isCompleted = dto.isCompleted;
    }

    const response = await axiosClient.patch<ApiResponse<Task>>(
      `/tasks/${id}`,
      payload,
    );
    if (!response.data.data) {
      throw new Error("Failed to update task");
    }
    return response.data.data;
  },

  async deleteTask(id: string): Promise<Task> {
    const response = await axiosClient.delete<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.data) {
      throw new Error("Failed to delete task");
    }
    return response.data.data;
  },
};
