import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginService,
  getCurrentUser,
  logout as logoutService,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Session restore error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const loggedInUser = await loginService(email, password);
    setUser(loggedInUser);
  }

  async function logout() {
    await logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
