import { useState } from "react";
import { Input } from "antd";
import { useTasks } from "@/context/TaskContext";
import type { Task } from "@/types/task";
import { cn } from "@/utils/cn";

interface TodoItemTitleProps {
  todo: Task;
  disabled?: boolean;
}

const TodoItemTitle = ({ todo, disabled }: TodoItemTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const { updateTaskTitle } = useTasks();

  const startEditing = () => {
    if (disabled) return;
    setDraftTitle(todo.title);
    setIsEditing(true);
  };

  const saveTitle = () => {
    if (draftTitle.trim() && draftTitle.trim() !== todo.title) {
      updateTaskTitle(todo.id, draftTitle.trim());
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setDraftTitle(todo.title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        aria-label={`Edit "${todo.title}"`}
        value={draftTitle}
        onChange={(event) => setDraftTitle(event.target.value)}
        onPressEnter={saveTitle}
        onBlur={saveTitle}
        onKeyDown={(event) => {
          if (event.key === "Escape") cancelEditing();
        }}
        className="min-w-0 flex-1"
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onDoubleClick={startEditing}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") startEditing();
      }}
      className={cn(
        "min-w-0 flex-1 cursor-pointer select-none wrap-break-words text-sm",
        todo.isCompleted && "text-font-secondary line-through",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      {todo.title}
    </span>
  );
};

export default TodoItemTitle;
