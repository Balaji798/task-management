/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
} from "../lib/types";
import { getCurrentUser } from "../lib/auth";
import { ERROR_MESSAGES, ROUTES } from "../utils/constants";
import apiClient from "@/lib/client";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  const handleAuthStateChange = useCallback(
    async (event: string, session: any) => {
      if (session?.user && session.user.email) {
        setAuthState({
          user: session.user as User,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // Don't initialize if we're on auth pages
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.includes("/auth/")) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
      }

      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await apiClient.get("/api/auth/me");
          console.log(response)
          if (response.data.user && response.data.user.email) {
            if (mounted) {
              setAuthState({
                user: response.data.user as User,
                isLoading: false,
                error: null,
              });
            }
            return;
          }
        }

        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.post("/api/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      console.log("response", response.data);
      if (response.data.error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            response.data.error.message ||
            ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        }));
        return;
      }

      if (response.data.user && response.data.user.email) {
        localStorage.setItem("token", response.data.session.access_token);
        setAuthState({
          user: response.data.user as User,
          isLoading: false,
          error: null,
        });
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
      }));
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.post("/api/auth/signup", {
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
      });

      if (response.data.error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            response.data.error.message || ERROR_MESSAGES.AUTH.EMAIL_INVALID,
        }));
        return;
      }

      // Handle successful signup but email not verified
      if (response.data.user && !response.data.user.email_confirmed_at) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: ERROR_MESSAGES.AUTH.VERIFICATION_EMAIL_SENT,
        }));
        //router.push(ROUTES.LOGIN);
        return;
      }

      // Handle immediate login (if email is already verified)
      if (response.data.user && response.data.user.email) {
        setAuthState({
          user: response.data.user as User,
          isLoading: false,
          error: null,
        });
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
      }));
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post("/api/auth/logout");

      if (response.data.error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            response.data.error.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
        }));
        return;
      }

      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
      router.push(ROUTES.LOGIN);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
      }));
    }
  };

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
