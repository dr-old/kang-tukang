// src/context/AuthProvider.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
// import { insertUser, getUserByEmail, initDB } from '@/utils/db';

// Define the User type
interface User {
  email: string;
  fullname?: string;
  photo?: string;
  phone?: string;
  createdAt: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  register: (
    email: string,
    password: string,
    fullname?: string,
    photo?: string,
    phone?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create a default value for context
const defaultAuthContextValue: AuthContextType = {
  user: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // initDB();
    // Optional: Add logic to check for an existing user session
  }, []);

  const register = async (
    email: string,
    password: string,
    fullname?: string,
    photo?: string,
    phone?: string
  ) => {
    const createdAt = new Date().toISOString();
    try {
      // await insertUser(email, password, fullname, photo, phone, createdAt);
      setUser({ email, fullname, photo, phone, createdAt });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // const user = await getUserByEmail(email);
      // if (user && user.password === password) {
      //   setUser(user);
      // } else {
      //   throw new Error('Invalid credentials');
      // }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    setUser(null);
    // Optional: Clear any persisted user data
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
