import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { AuthUser } from "../../application/ports";
import { getStoredSession } from "../../infrastructure/auth/authStorage";
import { container } from "../../infrastructure/repositories";

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredSession()?.user ?? null);

  const login = useCallback(async (email: string, password: string) => {
    const session = await container.auth.login(email, password);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    await container.auth.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function getStoredUser(): AuthUser | null {
  return getStoredSession()?.user ?? null;
}
