"use client";

import { useEffect,Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        router.push("/auth/login?error=no_token");
        return;
      }

      const verified = await verifyWithToken(token);

      if (verified) {
        router.push("/auth/login?message=email_verified");
      } else {
        router.push("/auth/login?error=verification_failed");
      }
    };

    verifyEmail();
  }, [router, searchParams]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your email...</p>
      </div>
    </div>
  );
}
export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

const verifyWithToken = async (token: string) => {
  try {
    const response = await apiClient.post("/api/auth/verify-email", {
      token,
    });

    const data = response.data;
    return data.verified;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};
