import TaskForm from "./TaskForm";

function formatDate(iso) {
  if (!iso) return "";
  // SQLite datetime is "YYYY-MM-DD HH:MM:SS" — treat as UTC-ish display
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TaskList({
  tasks,
  editingTask,
  onEdit,
  onCancelEdit,
  onUpdate,
  onToggle,
  onDelete,
}) {
  if (tasks.length === 0) {
    return (
      <div className="state-msg">
        No tasks yet. Add your first task above.
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          {editingTask?.id === task.id ? (
            <TaskForm
              editingTask={task}
              onSubmit={(data) => onUpdate(task.id, data)}
              onCancel={onCancelEdit}
            />
          ) : (
            <>
              <button
                type="button"
                className={`task-check ${task.completed ? "checked" : ""}`}
                onClick={() => onToggle(task)}
                aria-label={
                  task.completed ? "Mark as incomplete" : "Mark as completed"
                }
                title={task.completed ? "Mark incomplete" : "Mark complete"}
              >
                {task.completed ? "✓" : ""}
              </button>

              <div className="task-body">
                <div className="task-title">{task.title}</div>
                {task.description ? (
                  <div className="task-desc">{task.description}</div>
                ) : null}
                <div className="task-date">
                  Created {formatDate(task.created_at)}
                  {task.updated_at && task.updated_at !== task.created_at
                    ? ` · Updated ${formatDate(task.updated_at)}`
                    : ""}
                </div>
              </div>

              <div className="task-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm("Delete this task?")) {
                      onDelete(task.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
