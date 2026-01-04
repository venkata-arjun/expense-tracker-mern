import api from "./axios";

export const upsertBudget = (data) => api.post("/budgets", data);

export const getBudgets = (params) => api.get("/budgets", { params });
