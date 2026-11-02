const API_BASE = "/api";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("eventHubToken");
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not reach the server. Check that the backend is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function jsonBody(data) {
  return JSON.stringify(data);
}

export function registerUser(userData) {
  return apiRequest("/auth/register", { method: "POST", body: jsonBody(userData) });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", { method: "POST", body: jsonBody(credentials) });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function getEvents(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) params.set(key, value.trim());
  });
  const query = params.toString();
  return apiRequest(`/events${query ? `?${query}` : ""}`);
}

export function getEventById(id) {
  return apiRequest(`/events/${encodeURIComponent(id)}`);
}

export function createEvent(eventData) {
  return apiRequest("/events", { method: "POST", body: jsonBody(eventData) });
}

export function updateEvent(id, eventData) {
  return apiRequest(`/events/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: jsonBody(eventData),
  });
}

export function deleteEvent(id) {
  return apiRequest(`/events/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function registerForEvent(eventId) {
  return apiRequest("/registrations", {
    method: "POST",
    body: jsonBody({ eventId }),
  });
}

export function getMyRegistrations() {
  return apiRequest("/registrations/me");
}

export function cancelRegistration(registrationId) {
  return apiRequest(`/registrations/${encodeURIComponent(registrationId)}`, {
    method: "DELETE",
  });
}

export function getAllRegistrations() {
  return apiRequest("/registrations");
}
