export const upsertBudget = (data) => api.post("/budgets", data);
import api from "./axios";

export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

export const getBudgets = (params) => api.get("/budgets", { params });
