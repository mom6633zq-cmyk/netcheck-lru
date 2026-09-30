import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

export interface CurrentUser {
  id: number;
  name: string;
  studentId: string | null;
  email: string;
  phone: string | null;
  faculty: string | null;
  role: 'user' | 'admin';
}

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  register: (payload: { name: string; studentId?: string; email: string; phone?: string; faculty?: string; password: string }) => Promise<CurrentUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On load, ask the server if we already have a valid PHP session cookie.
  useEffect(() => {
    api.me()
      .then((res: any) => {
        const u = res?.user ?? res?.data?.user ?? (res?.id ? res : null);
        setUser(u);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res: any = await api.login(email, password);
    const u = res?.user ?? res?.data?.user ?? (res?.id ? res : null);
    if (!u) {
      throw new Error(res?.message || res?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    setUser(u as CurrentUser);
    return u as CurrentUser;
  };

  const register = async (payload: { name: string; studentId?: string; email: string; phone?: string; faculty?: string; password: string }) => {
    const res: any = await api.register(payload);
    const u = res?.user ?? res?.data?.user ?? (res?.id ? res : null);
    if (!u) {
      throw new Error(res?.message || res?.data?.message || 'ไม่สามารถสมัครสมาชิกได้');
    }
    setUser(u as CurrentUser);
    return u as CurrentUser;
  };

  const logout = () => {
    api.logout().catch(() => {});
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res: any = await api.me();
      const u = res?.user ?? res?.data?.user ?? (res?.id ? res : null);
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}