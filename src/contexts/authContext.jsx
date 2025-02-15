import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : { isLoggedIn: false, userId: null, userName:null };
  });

  
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const login = (userId, userName) => {
    setAuth({
      isLoggedIn: true,
      userId: userId,
      userName:userName
    });
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      userId: null,
      userName:null
    });
    localStorage.removeItem("auth"); 
  };

  const value = {
    auth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
