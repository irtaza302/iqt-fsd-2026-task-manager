const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export const tasksApi = {
  getAll: () => request("/api/tasks"),
  create: (body) =>
    request("/api/tasks", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id) => request(`/api/tasks/${id}`, { method: "DELETE" }),
};

export const weatherApi = {
  get: (city) =>
    request(`/api/weather?city=${encodeURIComponent(city)}`),
};
