import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { App as AntdApp } from "antd";
import { taskApi } from "@/api/taskApi";
import type { Task, TaskFilter } from "@/types/task";
import { TaskContext, type TaskContextValue } from "./TaskContext";

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { message } = AntdApp.useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const addLoadingId = useCallback((id: string) => {
    setLoadingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeLoadingId = useCallback((id: string) => {
    setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to load tasks";
      message.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [message]);

  useEffect(() => {
    let isMounted = true;
    taskApi
      .getAllTasks()
      .then((data) => {
        if (isMounted) {
          setTasks(data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          const msg =
            error instanceof Error ? error.message : "Failed to load tasks";
          message.error(msg);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [message]);

  const createTask = useCallback(
    async (title: string): Promise<boolean> => {
      const trimmed = title.trim();
      if (!trimmed) return false;

      setIsCreating(true);
      try {
        const newTask = await taskApi.createTask({ title: trimmed });
        setTasks((prev) => [newTask, ...prev]);
        message.success("Task added successfully");
        return true;
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to create task";
        message.error(msg);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [message],
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;

      const newCompleted = !target.isCompleted;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: newCompleted } : t)),
      );
      addLoadingId(id);

      try {
        const updated = await taskApi.updateTask(id, { isCompleted: newCompleted });
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (error) {
        // Rollback
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isCompleted: !newCompleted } : t)),
        );
        const msg = error instanceof Error ? error.message : "Failed to update task";
        message.error(msg);
      } finally {
        removeLoadingId(id);
      }
    },
    [tasks, addLoadingId, removeLoadingId, message],
  );

  const updateTaskTitle = useCallback(
    async (id: string, title: string) => {
      const trimmed = title.trim();
      const target = tasks.find((t) => t.id === id);
      if (!target || trimmed === target.title) return;

      if (!trimmed) {
        message.warning("Title cannot be empty");
        return;
      }

      const previousTitle = target.title;
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)),
      );
      addLoadingId(id);

      try {
        const updated = await taskApi.updateTask(id, { title: trimmed });
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        message.success("Task updated");
      } catch (error) {
        // Rollback
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, title: previousTitle } : t)),
        );
        const msg = error instanceof Error ? error.message : "Failed to update title";
        message.error(msg);
      } finally {
        removeLoadingId(id);
      }
    },
    [tasks, addLoadingId, removeLoadingId, message],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;

      addLoadingId(id);
      try {
        await taskApi.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        message.success("Task deleted");
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to delete task";
        message.error(msg);
      } finally {
        removeLoadingId(id);
      }
    },
    [tasks, addLoadingId, removeLoadingId, message],
  );

  const clearCompleted = useCallback(async () => {
    const completedTasks = tasks.filter((t) => t.isCompleted);
    if (completedTasks.length === 0) return;

    const ids = completedTasks.map((t) => t.id);
    setLoadingIds((prev) => [...prev, ...ids]);

    try {
      const results = await Promise.allSettled(
        ids.map((id) => taskApi.deleteTask(id)),
      );

      const successfulIds = new Set<string>();
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successfulIds.add(ids[index]);
        }
      });

      setTasks((prev) => prev.filter((t) => !successfulIds.has(t.id)));

      if (successfulIds.size === ids.length) {
        message.success(`Cleared ${successfulIds.size} completed tasks`);
      } else {
        message.warning(
          `Cleared ${successfulIds.size} of ${ids.length} completed tasks`,
        );
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to clear completed tasks";
      message.error(msg);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  }, [tasks, message]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active") return !task.isCompleted;
      if (filter === "completed") return task.isCompleted;
      return true;
    });
  }, [tasks, filter]);

  const value: TaskContextValue = useMemo(
    () => ({
      tasks,
      filteredTasks,
      filter,
      setFilter,
      isLoading,
      isCreating,
      loadingIds,
      fetchTasks,
      createTask,
      toggleTask,
      updateTaskTitle,
      deleteTask,
      clearCompleted,
    }),
    [
      tasks,
      filteredTasks,
      filter,
      isLoading,
      isCreating,
      loadingIds,
      fetchTasks,
      createTask,
      toggleTask,
      updateTaskTitle,
      deleteTask,
      clearCompleted,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
