/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Link from 'next/link';
import { APP_CONFIG, ROUTES } from '../../utils/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
  };
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {APP_CONFIG.name}
              </h1>
              <p className="text-blue-100 text-sm">
                {APP_CONFIG.description}
              </p>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Welcome Back
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Organize Tasks Efficiently</h3>
                  <p className="text-blue-100 text-sm">
                    Create, manage, and track your tasks with our intuitive interface
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Set Priorities</h3>
                  <p className="text-blue-100 text-sm">
                    Prioritize your tasks by importance and urgency
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Track Progress</h3>
                  <p className="text-blue-100 text-sm">
                    Monitor your task completion and stay productive
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="mt-auto pt-8">
            <blockquote className="text-blue-100 italic">
              "The secret of getting ahead is getting started."
            </blockquote>
            <cite className="text-blue-200 text-sm not-italic mt-2 block">
              — Mark Twain
            </cite>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg mx-auto w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {APP_CONFIG.name}
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            {children}
          </div>

          {/* Footer */}
          {(footerText || footerLink) && (
            <div className="mt-6 text-center">
              {footerText && (
                <span className="text-gray-600 text-sm">
                  {footerText}{' '}
                </span>
              )}
              {footerLink && (
                <Link
                  href={footerLink.href}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {footerLink.text}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href={ROUTES.HOME}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors flex items-center justify-center space-x-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;