import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const forgeFable = (prompt, model, keywords = []) =>
  api.post("/fable/forge", { prompt, model, keywords }).then((r) => r.data);

export const getRecentStories = (limit = 20, skip = 0) =>
  api.get(`/stories?limit=${limit}&skip=${skip}`).then((r) => r.data);

export const submitFeedback = (id, feedback) =>
  api.post(`/stories/${id}/feedback`, { feedback }).then((r) => r.data);
