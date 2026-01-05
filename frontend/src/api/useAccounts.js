import { useEffect, useState, useCallback } from "react";
import { getAccounts } from "../api/accounts";

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAccounts();
      setAccounts(res.data || []);
    } catch {
      setAccounts([]);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    refetchAccounts: fetchAccounts,
  };
}
