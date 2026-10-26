import { Empty, Spin } from "antd";
import { useTasks } from "@/context/TaskContext";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const { tasks, filteredTasks, isLoading } = useTasks();

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-40">
        <Spin size="large" tip="Loading tasks..." />
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <Empty
        className="mt-12 select-none"
        description={tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
      />
    );
  }

  return (
    <ul className="flex list-none flex-col gap-2 overflow-y-auto pr-1">
      {filteredTasks.map((task) => (
        <TodoItem key={task.id} todo={task} />
      ))}
    </ul>
  );
};

export default TodoList;
