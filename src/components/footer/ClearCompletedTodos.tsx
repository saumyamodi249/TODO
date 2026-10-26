import { Button, Popconfirm } from "antd";
import { useTasks } from "@/context/TaskContext";

const ClearCompletedTodos = () => {
  const { tasks, clearCompleted } = useTasks();
  const completedCount = tasks.filter((task) => task.isCompleted).length;

  return (
    <Popconfirm
      title="Clear completed tasks?"
      description={`This will remove ${completedCount} completed ${
        completedCount === 1 ? "task" : "tasks"
      }.`}
      onConfirm={clearCompleted}
      okText="Clear"
      okButtonProps={{ danger: true }}
      disabled={completedCount === 0}
    >
      <Button type="text" danger disabled={completedCount === 0}>
        Clear completed
      </Button>
    </Popconfirm>
  );
};

export default ClearCompletedTodos;