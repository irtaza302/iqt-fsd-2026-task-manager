const express = require("express");
const db = require("../db");

const router = express.Router();

/**
 * GET /api/tasks
 * Returns all tasks, newest first.
 */
router.get("/", (req, res) => {
  try {
    const tasks = db
      .prepare(
        `SELECT id, title, description, completed, created_at, updated_at
         FROM tasks
         ORDER BY created_at DESC`
      )
      .all()
      .map((t) => ({ ...t, completed: Boolean(t.completed) }));

    res.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/**
 * GET /api/tasks/:id
 * Returns a single task by id.
 */
router.get("/:id", (req, res) => {
  try {
    const task = db
      .prepare(
        `SELECT id, title, description, completed, created_at, updated_at
         FROM tasks WHERE id = ?`
      )
      .get(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ ...task, completed: Boolean(task.completed) });
  } catch (error) {
    console.error("GET /api/tasks/:id error:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

/**
 * POST /api/tasks
 * Creates a new task. Body: { title, description? }
 */
router.post("/", (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = db
      .prepare(
        `INSERT INTO tasks (title, description) VALUES (?, ?)`
      )
      .run(title.trim(), String(description).trim());

    const task = db
      .prepare(
        `SELECT id, title, description, completed, created_at, updated_at
         FROM tasks WHERE id = ?`
      )
      .get(result.lastInsertRowid);

    res.status(201).json({ ...task, completed: Boolean(task.completed) });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

/**
 * PUT /api/tasks/:id
 * Updates a task. Body: { title?, description?, completed? }
 */
router.put("/:id", (req, res) => {
  try {
    const existing = db
      .prepare(`SELECT id FROM tasks WHERE id = ?`)
      .get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, description, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
    }

    const current = db
      .prepare(
        `SELECT title, description, completed FROM tasks WHERE id = ?`
      )
      .get(req.params.id);

    const newTitle = title !== undefined ? title.trim() : current.title;
    const newDescription =
      description !== undefined
        ? String(description).trim()
        : current.description;
    const newCompleted =
      completed !== undefined ? (completed ? 1 : 0) : current.completed;

    db.prepare(
      `UPDATE tasks
       SET title = ?, description = ?, completed = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(newTitle, newDescription, newCompleted, req.params.id);

    const task = db
      .prepare(
        `SELECT id, title, description, completed, created_at, updated_at
         FROM tasks WHERE id = ?`
      )
      .get(req.params.id);

    res.json({ ...task, completed: Boolean(task.completed) });
  } catch (error) {
    console.error("PUT /api/tasks/:id error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task by id.
 */
router.delete("/:id", (req, res) => {
  try {
    const result = db
      .prepare(`DELETE FROM tasks WHERE id = ?`)
      .run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", id: Number(req.params.id) });
  } catch (error) {
    console.error("DELETE /api/tasks/:id error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
