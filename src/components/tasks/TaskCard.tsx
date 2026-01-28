/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Task } from '../../lib/types';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import Button from '../ui/Button';
import Modal from '../ui/Modale';

export interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isLoading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  isLoading = false
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const statusColors = {
    [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
    [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  };

  const priorityColors = {
    [TASK_PRIORITY.LOW]: 'bg-gray-100 text-gray-700 border-gray-200',
    [TASK_PRIORITY.MEDIUM]: 'bg-orange-100 text-orange-700 border-orange-200',
    [TASK_PRIORITY.HIGH]: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusIcons = {
    [TASK_STATUS.PENDING]: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    [TASK_STATUS.IN_PROGRESS]: (
      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    [TASK_STATUS.COMPLETED]: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.293a1 1 0 00-1.414 1.414L14.586 10l-1.293 1.293a1 1 0 101.414 1.414L16 11.414l1.293 1.293a1 1 0 001.414-1.414L17.414 10l1.293-1.293a1 1 0 00-1.414-1.414L16 8.586l-1.293-1.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  const handleStatusChange = (newStatus: typeof TASK_STATUS[keyof typeof TASK_STATUS]) => {
    const updatedTask = { ...task, status: newStatus };
    onUpdate(updatedTask);
  };

  const handlePriorityChange = (newPriority: typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY]) => {
    const updatedTask = { ...task, priority: newPriority };
    onUpdate(updatedTask);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className={`rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${isLoading ? 'opacity-50' : ''}`}>
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        {/* Status and Priority */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusColors[task.status]}`}>
            {statusIcons[task.status]}
            <span className="capitalize">{task.status.replace('_', ' ')}</span>
          </div>
          <div className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${priorityColors[task.priority]}`}>
            {priorityIcons[task.priority]}
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Edit Controls */}
        {isEditing && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as typeof TASK_STATUS[keyof typeof TASK_STATUS])}
                className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={TASK_STATUS.PENDING}>Pending</option>
                <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={TASK_STATUS.COMPLETED}>Completed</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY])}
                className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={TASK_PRIORITY.LOW}>Low</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY.HIGH}>High</option>
              </select>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created: {formatDate(task.created_at)}</span>
          {task.updated_at !== task.created_at && (
            <span>Updated: {formatDate(task.updated_at)}</span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;