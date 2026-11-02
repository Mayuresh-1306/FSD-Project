import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../services/api.js";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      const token = localStorage.getItem("eventHubToken");
      if (!token) {
        if (active) setAuthLoading(false);
        return;
      }
      try {
        const data = await getCurrentUser();
        if (active) setUser(data.user);
      } catch {
        localStorage.removeItem("eventHubToken");
        if (active) setUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    }
    restoreSession();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("eventHubToken", data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    localStorage.setItem("eventHubToken", data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("eventHubToken");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, authLoading, login, register, logout }),
    [user, authLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
