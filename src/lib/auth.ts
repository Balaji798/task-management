/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./client";
import { supabase } from "./supabase";

export const getCurrentUser = async () => {
  const response = await apiClient.get("/api/auth/me");
  return response.data;
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};