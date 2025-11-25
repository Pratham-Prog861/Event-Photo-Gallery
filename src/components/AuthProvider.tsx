import React, { createContext, useContext, useState } from "react";

type User = { id: string; name: string };
const AuthContext = createContext<{ user: User }>({ user: { id: "anon", name: "Anonymous" } });

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<User>({ id: "anon", name: "Anonymous" });
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
