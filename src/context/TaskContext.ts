import { createContext, useContext } from "react";
import type { Task, TaskFilter } from "@/types/task";

export interface TaskContextValue {
  tasks: Task[];
  filteredTasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  isLoading: boolean;
  isCreating: boolean;
  loadingIds: string[];
  fetchTasks: () => Promise<void>;
  createTask: (title: string) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  updateTaskTitle: (id: string, title: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

export const useTasks = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
