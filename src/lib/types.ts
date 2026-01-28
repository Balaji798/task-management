import { TASK_STATUS, TASK_PRIORITY } from "../utils/constants";

// User types
export interface User {
  id: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  priority: (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  priority?: (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  priority?: (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];
}

// Auth types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface TaskFormState {
  title: FormField;
  description: FormField;
  status: FormField;
  priority: FormField;
}

export interface AuthFormState {
  email: FormField;
  password: FormField;
  confirmPassword?: FormField;
}

// Component prop types
export interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void; // Add this
  isLoading?: boolean;
}

export interface TaskFormProps {
  task?: Task | null;
  setIsModalOpen: (open: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (credentials: LoginCredentials | SignupCredentials) => void;
  isLoading?: boolean;
  error?: string | null;
}

// UI State types
export interface ModalState {
  isOpen: boolean;
  content: "create-task" | "edit-task" | null;
  task?: Task;
}

export interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
}

// Filter and Sort types
export interface TaskFilters {
  status?: (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
  priority?: (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];
  search?: string;
}

export interface TaskSort {
  field: "title" | "status" | "priority" | "created_at" | "updated_at";
  direction: "asc" | "desc";
}
