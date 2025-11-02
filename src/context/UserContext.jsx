import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [preference, setPreference] = useState(() => {
    return localStorage.getItem("preference")?.toLowerCase() || "both";
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    if (preference) localStorage.setItem("preference", preference);
  }, [user, preference]);

  return (
    <UserContext.Provider value={{ user, setUser, preference, setPreference }}>
      {children}
    </UserContext.Provider>
  );
};
