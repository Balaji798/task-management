/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from './error-handler';

export function validateTaskData(data: any) {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new ApiError('Title is required and must be a non-empty string', 400);
  }

  if (data.description && typeof data.description !== 'string') {
    throw new ApiError('Description must be a string', 400);
  }

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (data.status && !validStatuses.includes(data.status)) {
    throw new ApiError('Invalid status', 400);
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (data.priority && !validPriorities.includes(data.priority)) {
    throw new ApiError('Invalid priority', 400);
  }

  return true;
}

export function validateAuthData(data: any, type: 'login' | 'signup') {
  if (type === 'signup') {
    if (!data.email || !data.password || !data.confirmPassword) {
      throw new ApiError('All fields are required', 400);
    }
    if (data.password !== data.confirmPassword) {
      throw new ApiError('Passwords do not match', 400);
    }
  } else {
    if (!data.email || !data.password) {
      throw new ApiError('Email and password are required', 400);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new ApiError('Invalid email format', 400);
  }

  if (data.password.length < 6) {
    throw new ApiError('Password must be at least 6 characters', 400);
  }

  return true;
}