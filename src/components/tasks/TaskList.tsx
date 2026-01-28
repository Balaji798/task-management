/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Task, TaskFilters, TaskSort } from "../../lib/types";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import TaskItem from "./TaskItem";
import Loading from "../ui/Loading";
import Button from "../ui/Button";

export interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void; // Add this
  onRefresh?: () => void;
  filters?: TaskFilters;
  sort?: TaskSort;
  onFiltersChange?: (filters: TaskFilters) => void;
  onSortChange?: (sort: TaskSort) => void;
  handelEditTask?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading = false,
  error = null,
  onDelete,
  onRefresh,
  filters = {},
  sort = { field: "created_at", direction: "desc" },
  onFiltersChange,
  onSortChange,
  handelEditTask,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        (task.description &&
          task.description.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && task.status !== filters.status) return false;

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) return false;

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const { field, direction } = sort;

    let aValue: any = a[field];
    let bValue: any = b[field];

    // Handle date fields
    if (field === "created_at" || field === "updated_at") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle string fields
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (direction === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onFiltersChange) {
      onFiltersChange({ ...filters, search: value });
    }
  };

  const handleStatusFilterChange = (
    status: (typeof TASK_STATUS)[keyof typeof TASK_STATUS] | "",
  ) => {
    const newFilters = status
      ? { ...filters, status }
      : { ...filters, status: undefined };
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handlePriorityFilterChange = (
    priority: (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY] | "",
  ) => {
    const newFilters = priority
      ? { ...filters, priority }
      : { ...filters, priority: undefined };
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleSortChange = (field: TaskSort["field"]) => {
    const newDirection: "asc" | "desc" =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    const newSort = { field, direction: newDirection };
    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  const getSortIcon = (field: TaskSort["field"]) => {
    if (sort.field !== field) {
      return (
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sort.direction === "asc" ? (
      <svg
        className="h-4 w-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
    ) : (
      <svg
        className="h-4 w-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
        />
      </svg>
    );
  };

  // Count tasks by status
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === TASK_STATUS.PENDING).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS)
      .length,
    completed: tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length,
  };
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-600"
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
        </div>
        <h3 className="mb-2 text-lg font-medium text-red-900">
          Error loading tasks
        </h3>
        <p className="mb-4 text-red-700">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-[360px] sm:max-w-none">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              Total: <strong>{taskCounts.total}</strong>
            </span>
            <span>
              Pending: <strong>{taskCounts.pending}</strong>
            </span>
            <span>
              In Progress: <strong>{taskCounts.inProgress}</strong>
            </span>
            <span>
              Completed: <strong>{taskCounts.completed}</strong>
            </span>
          </div>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={isLoading}
            className="shrink-0"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center max-w-[360px] sm:max-w-none">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ""}
          onChange={(e) => handleStatusFilterChange(e.target.value as any)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value={TASK_STATUS.PENDING}>Pending</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.COMPLETED}>Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ""}
          onChange={(e) => handlePriorityFilterChange(e.target.value as any)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Priority</option>
          <option value={TASK_PRIORITY.LOW}>Low</option>
          <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
          <option value={TASK_PRIORITY.HIGH}>High</option>
        </select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 text-sm max-w-[360px] sm:max-w-none">
        <span className="text-gray-500">Sort by:</span>
        <button
          onClick={() => handleSortChange("title")}
          className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${sort.field === "title" ? "text-blue-600" : "text-gray-600"}`}
        >
          Title
          {getSortIcon("title")}
        </button>
        <button
          onClick={() => handleSortChange("status")}
          className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${sort.field === "status" ? "text-blue-600" : "text-gray-600"}`}
        >
          Status
          {getSortIcon("status")}
        </button>
        <button
          onClick={() => handleSortChange("priority")}
          className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${sort.field === "priority" ? "text-blue-600" : "text-gray-600"}`}
        >
          Priority
          {getSortIcon("priority")}
        </button>
        <button
          onClick={() => handleSortChange("created_at")}
          className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${sort.field === "created_at" ? "text-blue-600" : "text-gray-600"}`}
        >
          Created
          {getSortIcon("created_at")}
        </button>
      </div>

      {/* Task List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {isLoading ? (
          <div className="p-8">
            <Loading size="lg" text="Loading tasks..." />
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.status || filters.priority
                ? "Try adjusting your filters or search terms"
                : "Get started by creating your first task"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={onDelete}
                isLoading={isLoading}
                handelEditTask={handelEditTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with results count */}
      {!isLoading && sortedTasks.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {sortedTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
};

export default TaskList;
