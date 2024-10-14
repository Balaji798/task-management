import React, { useState } from "react";

interface TaskFilterProps {
  onFilterChange: (status: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const statuses = ["To Do", "In Progress", "Completed"];
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    onFilterChange(newStatus);
  };
  return (
    <div style={{ maxWidth: "150px", width: "100%" }}>
      <label htmlFor="status-filter">Filter by Status: </label>
      <select
        id="status-filter"
        value={selectedStatus}
        onChange={handleStatusChange}
        className="task-filter-select"
      >
        <option value="">All Tasks</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilter;
