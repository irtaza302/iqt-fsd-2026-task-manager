const express = require("express");
const cors = require("cors");
const path = require("path");
const tasksRouter = require("./routes/tasks");
const weatherRouter = require("./routes/weather");

// Ensure DB is initialized on startup
require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Task Manager API is running" });
});

// REST API routes
app.use("/api/tasks", tasksRouter);
app.use("/api/weather", weatherRouter);

// Serve frontend build in production (optional)
const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Task Manager API listening on http://localhost:${PORT}`);
  console.log(`  GET    /api/tasks`);
  console.log(`  POST   /api/tasks`);
  console.log(`  PUT    /api/tasks/:id`);
  console.log(`  DELETE /api/tasks/:id`);
  console.log(`  GET    /api/weather?city=London`);
});
