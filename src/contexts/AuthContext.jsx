import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('datapaket_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
    const data = await res.json();
    if (data.length === 0) throw new Error('Email atau password salah');
    const { password: _, ...safeUser } = data[0];
    setUser(safeUser);
    localStorage.setItem('datapaket_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('datapaket_user');
  };

  // Update active package after purchase & persist to json-server + localStorage
  const updateActivePackage = async (pkg) => {
    if (!user) return;
    const newActivePackage = {
      name: pkg.name,
      expiry: new Date(Date.now() + pkg.validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remaining: pkg.quota,
      quota: pkg.quota,
    };
    const updatedUser = { ...user, activePackage: newActivePackage };

    // Update in json-server
    try {
      await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activePackage: newActivePackage }),
      });
    } catch (e) {
      console.warn('Could not update user in server, updating locally only');
    }

    setUser(updatedUser);
    localStorage.setItem('datapaket_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateActivePackage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
