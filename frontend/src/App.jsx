import { useCallback, useEffect, useState } from "react";
import { tasksApi, weatherApi } from "./api";
import WeatherWidget from "./components/WeatherWidget";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async ({ title, description }) => {
    const created = await tasksApi.create({ title, description });
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdate = async (id, updates) => {
    const updated = await tasksApi.update(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditingTask(null);
  };

  const handleToggle = async (task) => {
    await handleUpdate(task.id, { completed: !task.completed });
  };

  const handleDelete = async (id) => {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingTask?.id === id) setEditingTask(null);
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="app">
      <header className="header">
        <span className="badge">IQT-FSD-2026</span>
        <h1>Task Manager</h1>
        <p>Full Stack assessment — React · Express · SQLite</p>
      </header>

      <WeatherWidget fetchWeather={weatherApi.get} />

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <TaskForm
        onSubmit={handleAdd}
        editingTask={null}
        onCancel={() => {}}
      />

      <div className="stats">
        <div className="stat">
          <strong>{total}</strong> total
        </div>
        <div className="stat">
          <strong>{pending}</strong> pending
        </div>
        <div className="stat">
          <strong>{completed}</strong> done
        </div>
      </div>

      {loading ? (
        <div className="state-msg">Loading tasks…</div>
      ) : (
        <TaskList
          tasks={tasks}
          editingTask={editingTask}
          onEdit={setEditingTask}
          onCancelEdit={() => setEditingTask(null)}
          onUpdate={handleUpdate}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
