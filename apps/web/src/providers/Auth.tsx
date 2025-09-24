"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SupabaseAuthProvider } from "@/lib/auth/supabase";
import {
  AuthProvider as CustomAuthProvider,
  Session,
  User,
  AuthCredentials,
  AuthError,
} from "@/lib/auth/types";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: AuthCredentials) => Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;
  signUp: (credentials: AuthCredentials) => Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;
  signInWithGoogle: () => Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateUser: (attributes: Partial<User>) => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
}

// Factory to lazily create the default authentication provider (Supabase)
function createDefaultAuthProvider(): CustomAuthProvider | null {
  try {
    return new SupabaseAuthProvider({
      redirectUrl:
        typeof window !== "undefined" ? window.location.origin : undefined,
    });
  } catch (_e) {
    // Missing env at build-time or server environments without required vars.
    // Return null to allow pages to render without crashing.
    return null;
  }
}

// Create auth context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({
  children,
  customAuthProvider,
}: {
  children: React.ReactNode;
  customAuthProvider?: CustomAuthProvider;
}) {
  // Use the provided auth provider or default to Supabase
  const provider = customAuthProvider || createDefaultAuthProvider();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial session on mount
  useEffect(() => {
    if (!provider) {
      setIsLoading(false);
      return;
    }
    const initializeAuth = async () => {
      try {
        // Get the current session
        const currentSession = await provider.getSession();
        setSession(currentSession);

        // If we have a session, get the user
        if (currentSession?.user) {
          setUser(currentSession.user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [provider]);

  // Set up auth state change listener
  useEffect(() => {
    if (!provider) return;
    const { unsubscribe } = provider.onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      unsubscribe();
    };
  }, [provider]);

  const value = {
    session,
    user,
    isLoading,
    isAuthenticated: !!session?.user,
    signIn: provider?.signIn.bind(provider as any) ?? (async () => ({ user: null, session: null, error: { message: "Auth disabled", status: 500 } } as any)),
    signUp: provider?.signUp.bind(provider as any) ?? (async () => ({ user: null, session: null, error: { message: "Auth disabled", status: 500 } } as any)),
    signInWithGoogle: provider?.signInWithGoogle.bind(provider as any) ?? (async () => ({ user: null, session: null, error: { message: "Auth disabled", status: 500 } } as any)),
    signOut: provider?.signOut.bind(provider as any) ?? (async () => ({ error: { message: "Auth disabled", status: 500 } } as any)),
    resetPassword: provider?.resetPassword.bind(provider as any) ?? (async () => ({ error: { message: "Auth disabled", status: 500 } } as any)),
    updatePassword: provider?.updatePassword.bind(provider as any) ?? (async () => ({ error: { message: "Auth disabled", status: 500 } } as any)),
    updateUser: provider?.updateUser.bind(provider as any) ?? (async () => ({ user: null, error: { message: "Auth disabled", status: 500 } } as any)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
