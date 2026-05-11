import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();

const normalize = (u) => u ? { ...u, _id: u._id?.toString?.() ?? u._id } : null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return normalize(JSON.parse(localStorage.getItem("tb_user"))); }
    catch { return null; }
  });
  const [watchlist, setWatchlist] = useState([]);

  const login = useCallback((data) => {
    const u = normalize(data);
    localStorage.setItem("tb_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tb_user");
    setUser(null);
    setWatchlist([]);
  }, []);

  const updateUser = useCallback((data) => {
    const u = normalize({ ...user, ...data });
    localStorage.setItem("tb_user", JSON.stringify(u));
    setUser(u);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, watchlist, setWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
