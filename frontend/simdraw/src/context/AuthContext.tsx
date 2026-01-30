// src/context/AuthContext.tsx
import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react'
import type { IUser, IAuthContext } from '../types/user';



const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
 
  const login = (userData: IUser) : void => {
    setUser(userData);
  };

  const logout = () : void => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () : IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};