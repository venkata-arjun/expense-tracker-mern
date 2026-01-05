import axios from "./axios";

export const getAccounts = () => axios.get("/accounts");
export const createAccount = (data) => axios.post("/accounts", data);
export const updateAccount = (id, data) => axios.put(`/accounts/${id}`, data);
export const deleteAccount = (id) => axios.delete(`/accounts/${id}`);
