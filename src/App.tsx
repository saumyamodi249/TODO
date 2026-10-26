import { TaskProvider } from "./context";
import Home from "./pages/Home";

function App() {
  return (
    <TaskProvider>
      <Home />
    </TaskProvider>
  );
}

export default App;
