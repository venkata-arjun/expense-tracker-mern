import api from "./axios";

export const getSummary = (params) => api.get("/analytics/summary", { params });

export const getCategoryAnalytics = (params) =>
  api.get("/analytics/categories", { params });
