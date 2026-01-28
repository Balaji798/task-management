/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { SignupCredentials } from "../../lib/types";
import { ERROR_MESSAGES, VALIDATION_RULES } from "../../utils/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";

type FormFieldName = "email" | "password" | "confirmPassword";

const SignupForm: React.FC = () => {
  const { signup, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<SignupCredentials>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  // Clear errors when component unmounts or when user starts typing

  useEffect(() => {
    if (
      error &&
      (touched.email || touched.password || touched.confirmPassword)
    ) {
      clearError();
    }
  }, [
    formData.email,
    formData.password,
    formData.confirmPassword,
    touched,
    error,
    clearError,
  ]);

  const validateField = (name: FormFieldName, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          errorMessage = ERROR_MESSAGES.AUTH.EMAIL_REQUIRED;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = ERROR_MESSAGES.AUTH.EMAIL_INVALID;
        }
        break;

      case "password":
        if (!value.trim()) {
          errorMessage = ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED;
        } else if (value.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
          errorMessage = ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH;
        }
        break;

      case "confirmPassword":
        if (!value.trim()) {
          errorMessage = "Please confirm your password";
        } else if (value !== formData.password) {
          errorMessage = "Passwords do not match";
        }
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (name: FormFieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: FormFieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true, confirmPassword: true });

    // Validate all fields
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    const confirmPasswordError = validateField(
      "confirmPassword",
      formData.confirmPassword,
    );

    setFormErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // If there are validation errors, don't submit
    if (emailError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      await signup(formData);
      setShowSuccessMessage(true);
      setSignupEmail(formData.email);
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("remember_email", formData.email);
      } else {
        localStorage.removeItem("remember_email");
      }
    } catch (err) {
      // Error is handled by the auth hook
      console.error("Signup failed:", err);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remember_email");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const isFormValid =
    !formErrors.email &&
    !formErrors.password &&
    !formErrors.confirmPassword &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim();
  if (showSuccessMessage) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Check Your Email
          </h3>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to:
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-900 font-medium">{signupEmail}</p>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Click the verification link in the email to activate your account.
            If you don't see it, check your spam folder.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setShowSuccessMessage(false);
              setFormData({ email: "", password: "", confirmPassword: "" });
              setFormErrors({ email: "", password: "", confirmPassword: "" });
              setTouched({
                email: false,
                password: false,
                confirmPassword: false,
              });
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Sign up with a different email
          </button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Global Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="Enter your email"
          error={touched.email ? formErrors.email : ""}
          disabled={isLoading}
          autoComplete="email"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          placeholder="Enter your password"
          error={touched.password ? formErrors.password : ""}
          disabled={isLoading}
          autoComplete="new-password"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Password must be at least {VALIDATION_RULES.PASSWORD_MIN_LENGTH}{" "}
          characters long
        </p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          placeholder="Confirm your password"
          error={touched.confirmPassword ? formErrors.confirmPassword : ""}
          disabled={isLoading}
          autoComplete="new-password"
          required
        />
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-700"
        >
          Remember my email
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isLoading}
        disabled={!isFormValid}
        fullWidth
        size="lg"
        className="mt-6"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
