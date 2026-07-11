import { useState } from "react";

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState(editingTask?.title || "");
  const [description, setDescription] = useState(
    editingTask?.description || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(editingTask);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      if (!isEdit) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError(err.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit task" : "Add a new task"}</h2>

      {error && (
        <div className="error-banner" style={{ marginBottom: "0.75rem" }}>
          {error}
        </div>
      )}

      <div className="field">
        <label htmlFor={isEdit ? "edit-title" : "new-title"}>Title *</label>
        <input
          id={isEdit ? "edit-title" : "new-title"}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          required
        />
      </div>

      <div className="field">
        <label htmlFor={isEdit ? "edit-desc" : "new-desc"}>Description</label>
        <textarea
          id={isEdit ? "edit-desc" : "new-desc"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details…"
          maxLength={1000}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add task"}
        </button>
        {isEdit && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
