/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoginCredentials } from "../../lib/types";
import { ERROR_MESSAGES, VALIDATION_RULES } from "../../utils/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";

const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (error && touched.email) {
      clearError();
    }
  }, [formData.email, touched.email, error, clearError]);

  useEffect(() => {
    if (error && touched.password) {
      clearError();
    }
  }, [formData.password, touched.password, error, clearError]);

  const validateField = (name: string, value: string) => {
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
    }

    return errorMessage;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof LoginCredentials]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    setFormErrors({
      email: emailError,
      password: passwordError,
    });

    // If there are validation errors, don't submit
    if (emailError || passwordError) {
      return;
    }

    try {
      await login(formData);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("remember_email", formData.email);
      } else {
        localStorage.removeItem("remember_email");
      }
    } catch (err) {
      // Error is handled by the auth hook
      console.error("Login failed:", err);
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
    formData.email.trim() &&
    formData.password.trim();

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
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <a
            href="#forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement forgot password functionality
              console.log("Forgot password clicked");
            }}
          >
            Forgot password?
          </a>
        </div>
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
          autoComplete="current-password"
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
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
