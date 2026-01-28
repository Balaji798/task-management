/* eslint-disable @typescript-eslint/no-explicit-any */
import { TASK_STATUS, TASK_PRIORITY } from './constants';

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case TASK_STATUS.PENDING:
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case TASK_STATUS.IN_PROGRESS:
      return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    case TASK_STATUS.COMPLETED:
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    default:
      return 'text-slate-700 bg-slate-50 border-slate-200';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return 'text-red-700 bg-red-50 border-red-200';
    case TASK_PRIORITY.MEDIUM:
      return 'text-orange-700 bg-orange-50 border-orange-200';
    case TASK_PRIORITY.LOW:
      return 'text-slate-600 bg-slate-50 border-slate-200';
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

export const getPrimaryColor = (): string => {
  return '#160832';
};

export const getPrimaryColorClasses = (): string => {
  return 'bg-[#160832] text-white hover:bg-[#1f0f42] focus:bg-[#160832]';
};

export const getSecondaryColorClasses = (): string => {
  return 'bg-slate-100 text-[#160832] hover:bg-slate-200 focus:bg-slate-100';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

export const validateTaskTitle = (title: string): { isValid: boolean; message?: string } => {
  if (title.trim().length < 3) {
    return { isValid: false, message: 'Task title must be at least 3 characters long' };
  }
  return { isValid: true };
};

export const validateTaskDescription = (description: string): { isValid: boolean; message?: string } => {
  if (description.length > 500) {
    return { isValid: false, message: 'Description must be less than 500 characters' };
  }
  return { isValid: true };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};