import { useState } from "react";
import { Input, Spin } from "antd";
import { CornerDownLeft, Plus } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

const EnterSuffix = ({ isCreating }: { isCreating: boolean }) => {
  if (isCreating) {
    return (
      <div className="flex items-center px-2 py-1">
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div className="bg-background-secondary text-font-secondary rounded px-2 py-1 flex items-end gap-1 text-xs select-none">
      <CornerDownLeft className="size-3" />
      Enter
    </div>
  );
};

const TodoInput = () => {
  const [title, setTitle] = useState("");
  const { createTask, isCreating } = useTasks();

  const handlePressEnter = async () => {
    if (!title.trim() || isCreating) return;

    const success = await createTask(title);
    if (success) {
      setTitle("");
    }
  };

  return (
    <div>
      <Input
        prefix={<Plus strokeWidth={1} />}
        suffix={<EnterSuffix isCreating={isCreating} />}
        size="large"
        placeholder="What needs to be done?"
        value={title}
        disabled={isCreating}
        onChange={(event) => setTitle(event.target.value)}
        onPressEnter={handlePressEnter}
      />
    </div>
  );
};

export default TodoInput;
