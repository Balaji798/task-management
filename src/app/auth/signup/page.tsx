import AuthLayout from '@/components/auth/AuthLayout';
import { ROUTES } from '@/utils/constants';
import SignupForm from '@/components/auth/SignupFrom';

export default function LoginPage() {
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
      <SignupForm />
    </AuthLayout>
  );
}