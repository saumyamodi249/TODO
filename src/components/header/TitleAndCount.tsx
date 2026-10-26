import { useTasks } from "@/context/TaskContext";

const TitleAndCount = () => {
  const { tasks } = useTasks();

  return (
    <div className="inline-flex items-end gap-2">
      <span className="text-3xl font-medium">Tasks</span>
      <span className="tabular-nums text-xl font-light">[{tasks.length}]</span>
    </div>
  );
};

export default TitleAndCount;
