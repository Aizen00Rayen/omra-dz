import { createContext, useContext, useState } from 'react';
import initialData from '../data/db.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(initialData.users);

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (data) => {
    const exists = users.find(u => u.email === data.email);
    if (exists) return { success: false, error: 'Email already exists' };

    const newUser = {
      id: `u${Date.now()}`,
      ...data,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      createdAt: new Date().toISOString().split('T')[0],
      verified: false,
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
