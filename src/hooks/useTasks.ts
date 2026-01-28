import { useState, useEffect, useCallback } from "react";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  TaskSort,
  TaskListResponse,
  ApiResponse,
} from "../lib/types";
import { TASK_STATUS, TASK_PRIORITY } from "../utils/constants";
import { supabase } from "@/lib/supabase";
import apiClient from "@/lib/client";

interface UseTasksOptions {
  initialFilters?: TaskFilters;
  initialSort?: TaskSort;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(
    options.initialFilters || {},
  );
  const [sort, setSort] = useState<TaskSort>(
    options.initialSort || {
      field: "created_at",
      direction: "desc",
    },
  );

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);
      params.append("sortField", sort.field);
      params.append("sortDirection", sort.direction);

      const response = await apiClient.get(`/api/tasks?${params.toString()}`);
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort]);

  // Create a new task
  const createTask = useCallback(
    async (taskInput: CreateTaskInput): Promise<ApiResponse<Task>> => {
      setIsLoading(true);
      setError(null);

      try {
        // Get current user
        // const {
        //   data: { user },
        // } = await supabase.auth.getUser();
        // if (!user) {
        //   throw new Error("User not authenticated");
        // }

        // const { data: newTask, error } = await supabase
        //   .from("tasks")
        //   .insert({
        //     ...taskInput,
        //     user_id: user.id,
        //     status: taskInput.status || TASK_STATUS.PENDING,
        //     priority: taskInput.priority || TASK_PRIORITY.MEDIUM,
        //   })
        //   .select()
        //   .single();
        const response = await apiClient.post("/api/tasks", {
          ...taskInput,
          status: taskInput.status || TASK_STATUS.PENDING,
          priority: taskInput.priority || TASK_PRIORITY.MEDIUM,
        });
        console.log("response", response.data);
        if (response.data.error) {
          throw new Error(response.data.error.message);
        }

        setTasks((prev) => [...prev, response.data]);
        return { data: response.data, error: null, isLoading: false };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create task";
        setError(errorMessage);
        return { data: null, error: errorMessage, isLoading: false };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Update an existing task
  const updateTask = useCallback(
    async (
      taskId: string,
      taskInput: UpdateTaskInput,
    ): Promise<ApiResponse<Task>> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.put(`/api/tasks/${taskId}`, {
          ...taskInput,
          updated_at: new Date().toISOString(),
        });
        if (response.data.error) {
          throw new Error(response.data.error.message);
        }

        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? response.data : task)),
        );

        return { data: response.data, error: null, isLoading: false };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update task";
        setError(errorMessage);
        return { data: null, error: errorMessage, isLoading: false };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Delete a task
  const deleteTask = useCallback(
    async (taskId: string): Promise<ApiResponse<boolean>> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.delete(`/api/tasks/${taskId}`);

        if (response.data.error) {
          throw new Error(response.data.error.message);
        }

        setTasks((prev) => prev.filter((task) => task.id !== taskId));

        return { data: true, error: null, isLoading: false };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete task";
        setError(errorMessage);
        return { data: null, error: errorMessage, isLoading: false };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Toggle task status (quick action)
  const toggleTaskStatus = useCallback(
    async (taskId: string): Promise<void> => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newStatus =
        task.status === TASK_STATUS.COMPLETED
          ? TASK_STATUS.PENDING
          : TASK_STATUS.COMPLETED;

      await updateTask(taskId, { status: newStatus });
    },
    [tasks, updateTask],
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: Partial<TaskSort>) => {
    setSort((prev) => ({ ...prev, ...newSort }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get filtered and sorted tasks (client-side fallback)
  const getProcessedTasks = useCallback(() => {
    let processedTasks = [...tasks];

    // Apply filters
    if (filters.status) {
      processedTasks = processedTasks.filter(
        (task) => task.status === filters.status,
      );
    }
    if (filters.priority) {
      processedTasks = processedTasks.filter(
        (task) => task.priority === filters.priority,
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      processedTasks = processedTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower)),
      );
    }

    // Apply sorting
    processedTasks.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return processedTasks;
  }, [tasks, filters, sort]);

  // Fetch tasks on mount and when filters/sort change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // Data
    tasks: getProcessedTasks(),
    rawTasks: tasks,

    // Loading states
    isLoading,
    error,

    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,

    // Filter/Sort controls
    filters,
    sort,
    updateFilters,
    updateSort,
    clearFilters,
    refreshTasks: fetchTasks,
    // Computed values
    totalCount: tasks.length,
    filteredCount: getProcessedTasks().length,
  };
}

export default useTasks;
