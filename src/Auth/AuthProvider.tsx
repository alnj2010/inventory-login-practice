import {
  useContext,
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({
  isAuthenticated: false,
});

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
