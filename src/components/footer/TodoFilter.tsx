import { Segmented } from "antd";
import { useTasks } from "@/context/TaskContext";
import type { TaskFilter as TaskFilterValue } from "@/types/task";

const options: { label: string; value: TaskFilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

const TodoFilter = () => {
  const { filter, setFilter } = useTasks();

  return (
    <Segmented
      aria-label="Filter tasks"
      options={options}
      value={filter}
      onChange={(value) => {
        if (value === "all" || value === "active" || value === "completed") {
          setFilter(value);
        }
      }}
      size="small"
    />
  );
};

export default TodoFilter;