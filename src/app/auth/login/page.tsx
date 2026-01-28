"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please sign in to your account"
      footerText="Don't have an account?"
      footerLink={{
        text: "Sign up",
        href: ROUTES.SIGNUP,
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}