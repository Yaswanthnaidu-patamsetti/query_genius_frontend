import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);
  const login = (token) => {
    sessionStorage.setItem("access_token", token);
    setAccessToken(token);
  };
  const logout = () => {
    sessionStorage.removeItem("access_token");
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
