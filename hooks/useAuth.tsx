import { useApp } from "@realm/react";
import { useState, useCallback, useEffect } from "react";
import { Realm } from "@realm/react";
// src/context/AuthContext.tsx
import React, { createContext, useContext } from "react";
import { User } from "realm";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import { Redirect } from "expo-router";

export const useAuthRealm = (apiKey: string, signin: boolean) => {
  const app = useApp();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithKey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = Realm.Credentials.apiKey(apiKey);
      const user = await app.logIn(creds);
      setUser(user.id);
      console.log("Logged in:", user.id);
    } catch (err: any) {
      setError(err);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  }, [app, apiKey]);

  useEffect(() => {
    if (signin) signInWithKey();
  }, [signInWithKey, signin]);

  return {
    user,
    error,
    loading,
  };
};

interface AuthContextType {
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const app = useApp();
  const [user, setUser] = useState<User | null>(null);
  const { setProfile, setLogIn } = useUserStore() as unknown as UserStoreType;

  useEffect(() => {
    setUser(app.currentUser);
  }, [app]);

  const signIn = async (data: any) => {
    try {
      setLogIn(true);
      setProfile(data);
      setUser(data);
    } catch (err) {
      console.error("Failed to log in:", err);
    }
  };

  const signOut = async () => {
    if (user) {
      await user.logOut();
      setLogIn(false);
      setProfile(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function useProtected() {
  const { profile, isLoggedIn } = useUserStore() as unknown as UserStoreType;

  if (!isLoggedIn && !profile?._id) {
    return <Redirect href="/" />;
  }

  console.log(profile, isLoggedIn);

  return <Redirect href="/(tabs)" />;
}
