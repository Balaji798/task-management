import React from "react";
import { Task } from "../../lib/types";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import Button from "../ui/Button";
import useTasks from "@/hooks/useTasks";

export interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  isLoading?: boolean;
  handelEditTask?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  isLoading = false,
  handelEditTask,
}) => {
  const{updateTask} = useTasks()
  const statusColors = {
    [TASK_STATUS.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [TASK_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200",
    [TASK_STATUS.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
  };

  const priorityColors = {
    [TASK_PRIORITY.LOW]: "bg-gray-100 text-gray-700 border-gray-200",
    [TASK_PRIORITY.MEDIUM]: "bg-orange-100 text-orange-700 border-orange-200",
    [TASK_PRIORITY.HIGH]: "bg-red-100 text-red-700 border-red-200",
  };

  const statusIcons = {
    [TASK_STATUS.PENDING]: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    [TASK_STATUS.IN_PROGRESS]: (
      <svg
        className="h-4 w-4 animate-spin"
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
    ),
    [TASK_STATUS.COMPLETED]: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const priorityIcons = {
    [TASK_PRIORITY.LOW]: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
    [TASK_PRIORITY.MEDIUM]: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
    [TASK_PRIORITY.HIGH]: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.293a1 1 0 00-1.414 1.414L14.586 10l-1.293 1.293a1 1 0 101.414 1.414L16 11.414l1.293 1.293a1 1 0 001.414-1.414L17.414 10l1.293-1.293a1 1 0 00-1.414-1.414L16 8.586l-1.293-1.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const handleStatusChange = async(
    newStatus: (typeof TASK_STATUS)[keyof typeof TASK_STATUS],
  ) => {
    const updatedTaskItem = { ...task, status: newStatus };
    await updateTask(updatedTaskItem.id,updatedTaskItem)
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`border-b p-2 border-gray-200 py-3 transition-all hover:bg-gray-50 ${isLoading ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Title and Description */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Right side - Status, Priority, and Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Status */}
          <div
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusColors[task.status]}`}
          >
            {statusIcons[task.status]}
            <span className="capitalize hidden sm:inline">
              {task.status.replace("_", " ")}
            </span>
          </div>

          {/* Priority */}
          <div
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {priorityIcons[task.priority]}
            <span className="capitalize hidden sm:inline">{task.priority}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Quick Status Toggle */}
            <select
              value={task.status}
              onChange={(e) =>
                handleStatusChange(
                  e.target
                    .value as (typeof TASK_STATUS)[keyof typeof TASK_STATUS],
                )
              }
              className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>

            {/* Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handelEditTask?.(task)}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Button>
            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with dates */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>Created: {formatDate(task.created_at)}</span>
        {task.updated_at !== task.created_at && (
          <span>Updated: {formatDate(task.updated_at)}</span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
