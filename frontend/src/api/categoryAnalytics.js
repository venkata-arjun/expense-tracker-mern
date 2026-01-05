import api from "./axios";

export const getCategoryAnalyticsAll = (params) =>
  api.get("/analytics/categories/all", { params });
