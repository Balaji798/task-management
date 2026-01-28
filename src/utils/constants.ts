export const APP_CONFIG = {
  name: 'Task Management',
  version: '1.0.0',
  description: 'A simple task management application',
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const API_ENDPOINTS = {
  TASKS: '/tasks',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
} as const;

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    EMAIL_INVALID: 'Please enter a valid email address',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    VERIFICATION_EMAIL_SENT: 'Verification email sent. Please check your inbox.',
  },
  TASKS: {
    TITLE_REQUIRED: 'Task title is required',
    TITLE_MIN_LENGTH: 'Task title must be at least 3 characters',
    DESCRIPTION_MAX_LENGTH: 'Description must be less than 500 characters',
    CREATE_FAILED: 'Failed to create task',
    UPDATE_FAILED: 'Failed to update task',
    DELETE_FAILED: 'Failed to delete task',
    FETCH_FAILED: 'Failed to fetch tasks',
  },
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred',
    UNAUTHORIZED: 'You must be logged in to access this page',
  },
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  TASK_TITLE_MIN_LENGTH: 3,
  TASK_DESCRIPTION_MAX_LENGTH: 500,
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;