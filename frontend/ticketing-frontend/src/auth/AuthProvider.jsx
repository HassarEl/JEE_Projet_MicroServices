import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http, { setAuthToken } from "../api/http";

const AuthContext = createContext(null);

function normalizeRole(role) {
  if (!role) return null;
  return role.startsWith("ROLE_") ? role.replace("ROLE_", "") : role;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // ✅ on stocke DIRECTEMENT le rôle normalisé
  const [role, setRole] = useState(() => normalizeRole(localStorage.getItem("role")) || null);

  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role); // ✅ stocke ORGANIZER / USER / ADMIN
    else localStorage.removeItem("role");
  }, [role]);

  useEffect(() => {
    if (userId) localStorage.setItem("userId", String(userId));
    else localStorage.removeItem("userId");
  }, [userId]);

  const isAuthenticated = !!token;

  const user = useMemo(() => {
    if (!isAuthenticated) return null;
    return {
      id: userId ? Number(userId) : null,
      role: role || null, // ✅ déjà normalisé
    };
  }, [isAuthenticated, userId, role]);

  // ✅ LOGIN
  async function login(email, password) {
    const res = await http.post("/user-service/auth/login", { email, password });

    setToken(res.data.token);

    // ✅ normaliser ici
    setRole(normalizeRole(res.data.role));

    setUserId(res.data.userId);

    return res.data;
  }

  // ✅ REGISTER
  async function register(payload) {
    const res = await http.post("/user-service/auth/register", payload);
    return res.data;
  }

  function logout() {
    setToken(null);
    setRole(null);
    setUserId(null);
  }

  return (
      <AuthContext.Provider
          value={{
            token,
            role,     // ✅ maintenant role = ORGANIZER/USER/ADMIN
            userId,
            user,
            isAuthenticated,
            login,
            register,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
