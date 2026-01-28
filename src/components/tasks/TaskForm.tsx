/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFormProps,
} from "../../lib/types";
import { TASK_STATUS, TASK_PRIORITY } from "../../utils/constants";
import { ERROR_MESSAGES, VALIDATION_RULES } from "../../utils/constants";
import Input from "../ui/Input";
import Button from "../ui/Button";
import useTasks from "@/hooks/useTasks";

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  setIsModalOpen,
  onCancel,
  onRefresh,
}) => {
  const { createTask, refreshTasks, error, isLoading, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || TASK_STATUS.PENDING,
    priority: task?.priority || TASK_PRIORITY.MEDIUM,
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task]);

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = ERROR_MESSAGES.TASKS.TITLE_REQUIRED;
        } else if (
          value.trim().length < VALIDATION_RULES.TASK_TITLE_MIN_LENGTH
        ) {
          error = ERROR_MESSAGES.TASKS.TITLE_MIN_LENGTH;
        }
        break;
      case "description":
        if (
          value &&
          value.length > VALIDATION_RULES.TASK_DESCRIPTION_MAX_LENGTH
        ) {
          error = ERROR_MESSAGES.TASKS.DESCRIPTION_MAX_LENGTH;
        }
        break;
      default:
        break;
    }

    return error;
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
    const error = validateField(name, formData[name as keyof typeof formData]);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const titleError = validateField("title", formData.title);
    const descriptionError = validateField("description", formData.description);

    setFormErrors({
      title: titleError,
      description: descriptionError,
    });

    setTouched({
      title: true,
      description: true,
    });

    if (titleError || descriptionError) {
      return;
    }

    // Prepare submission data
    const submissionData: CreateTaskInput | UpdateTaskInput = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
    };
    if (task) {
      const taskItem = await updateTask(task.id, {
        title: submissionData.title || "",
        description: submissionData.description || "",
        status: submissionData.status,
        priority: submissionData.priority,
      });
      if (taskItem) {
        onRefresh?.();
        setIsModalOpen(false);
      }
    } else {
      const taskItem = await createTask({
        title: submissionData.title || "",
        description: submissionData.description || "",
        status: submissionData.status,
        priority: submissionData.priority,
      });
      if (taskItem) {
        onRefresh?.();
        setIsModalOpen(false);
      }
    }
  };

  const handleReset = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: TASK_STATUS.PENDING,
        priority: TASK_PRIORITY.MEDIUM,
      });
    }

    setFormErrors({
      title: "",
      description: "",
    });

    setTouched({
      title: false,
      description: false,
    });
  };

  const isFormValid =
    !formErrors.title &&
    !formErrors.description &&
    formData.title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Title Field */}
      <div>
        <Input
          label="Task Title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          error={touched.title ? formErrors.title : ""}
          placeholder="Enter task title..."
          required
          disabled={isLoading}
        />
        {!touched.title && (
          <p className="mt-1 text-xs text-gray-500">
            Title must be at least {VALIDATION_RULES.TASK_TITLE_MIN_LENGTH}{" "}
            characters
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Enter task description (optional)..."
            rows={4}
            disabled={isLoading}
            className={`block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
              touched.description && formErrors.description
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            } disabled:bg-gray-50 disabled:text-gray-500`}
          />
          {touched.description && formErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/
            {VALIDATION_RULES.TASK_DESCRIPTION_MAX_LENGTH} characters
          </p>
        </div>
      </div>

      {/* Status Field */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <div className="mt-1">
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            disabled={isLoading}
            className="block p-2 w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value={TASK_STATUS.PENDING}>Pending</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      {/* Priority Field */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>
        <div className="mt-1">
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
            disabled={isLoading}
            className="block p-2 w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value={TASK_PRIORITY.LOW}>Low</option>
            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITY.HIGH}>High</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        {!task && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        )}
        <Button
          type="submit"
          loading={isLoading}
          disabled={!isFormValid || isLoading}
          onClick={handleSubmit}
        >
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
