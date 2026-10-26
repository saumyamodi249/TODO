import { Button, Checkbox, Spin } from "antd";
import { X } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import type { Task } from "@/types/task";
import TodoItemTitle from "./TodoItemTitle";

const TodoItem = ({ todo }: { todo: Task }) => {
  const { toggleTask, deleteTask, loadingIds } = useTasks();
  const isBusy = loadingIds.includes(todo.id);

  return (
    <li className="group flex min-h-14 items-center gap-3 rounded-theme border border-border bg-background px-4 transition-colors hover:bg-background-secondary">
      {isBusy ? (
        <Spin size="small" className="shrink-0" />
      ) : (
        <Checkbox
          checked={todo.isCompleted}
          disabled={isBusy}
          onChange={() => toggleTask(todo.id)}
          aria-label={`Mark "${todo.title}" as ${
            todo.isCompleted ? "incomplete" : "complete"
          }`}
        />
      )}
      <TodoItemTitle todo={todo} disabled={isBusy} />
      <Button
        danger
        type="text"
        size="small"
        disabled={isBusy}
        icon={<X size={16} />}
        aria-label={`Delete "${todo.title}"`}
        onClick={() => deleteTask(todo.id)}
        className="shrink-0 text-font-secondary opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100"
      />
    </li>
  );
};

export default TodoItem;
