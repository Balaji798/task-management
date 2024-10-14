import { Modal } from "antd";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { Task } from "../types/Task";

interface TaskItemProps {
  item: Task; // Task object type
  handleEditTask: (task: Task) => void; // Function type that accepts a Task
  setIsModalOpen: (isOpen: boolean) => void; // Function to set modal state
  setTitle: (title: string) => void; // Function to set the modal title
  handleDeleteTask: (taskId: number) => void; // Change here to string
}
const TaskItem: React.FC<TaskItemProps> = ({
  item,
  handleEditTask,
  setIsModalOpen,
  setTitle,
  handleDeleteTask, // Add this line
}) => {
  const confirmDelete = () => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the task "${item.title}"?`,
      onOk: () => {
        if (item.id !== undefined) {
          handleDeleteTask(item.id); // Ensure item.id is a number
        } else {
          console.error("Task ID is undefined");
        }
      },
    });
  };
  return (
    <div className="list-item" key={item.id}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p
          style={{
            padding: "5px 0 10px",
            fontWeight: "bold",
            color: "#0d0c22",
          }}
        >
          {item?.title}
        </p>
        <div>
          <button
            onClick={() => {
              handleEditTask(item);
              setIsModalOpen(true);
              setTitle("Add Task");
            }}
          >
            <FiEdit size={25} color="#1677ff" />
          </button>
          <button
            onClick={confirmDelete}
          >
            <RiDeleteBin6Line size={24} color="red" />
          </button>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            backgroundColor:
              item.priority === "High"
                ? "rgba(255, 108, 108, 0.2)"
                : item.priority === "Low"
                ? "rgba(246, 187, 84, 0.3)"
                : "rgba(253, 99, 51, 0.5)",
            marginRight: "10px",
          }}
          className="danger"
        >
          <p
            style={{
              color:
                item.priority === "High"
                  ? "#ec5360"
                  : item.priority === "Low"
                  ? "#f6bb54"
                  : "#fd6333",
            }}
          >
            {item?.priority}
          </p>
        </div>
        <div
          style={{
            backgroundColor:
              item.status === "In Progress"
                ? "rgba(87, 175, 96, 0.3)"
                : item.status === "To Do"
                ? "rgba(237, 167, 255, 0.5)"
                : "rgba(42, 97, 238, 0.2)",
            marginRight: "10px",
          }}
          className="danger"
        >
          <p
            style={{
              color:
                item?.status === "In Progress"
                  ? "#57af60"
                  : item.status === "To Do"
                  ? "purple"
                  : "#2a61ee",
            }}
          >
            {item.status}
          </p>
        </div>
      </div>
      <p style={{paddingTop:"5px",fontWeight:"bold"}}>Description</p>
      <div style={{ padding: "5px 0 10px",height:"80px",overflowY:"scroll" }}>
      <p>{item?.description}</p>
      </div>
      <div>
        <p style={{fontWeight:"bold",paddingTop:"5px"}}>Assignee To</p>
        <p style={{ padding: "5px 0 10px" }}>{item?.assignee}</p>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", padding: "5px 0 10px",justifyContent:"flex-end" }}
      >
        <MdOutlineCalendarMonth size={18} />
        {/* Format due_date before displaying */}
        <p>
          {item?.due_date
            ? new Date(item.due_date).toLocaleDateString()
            : "No due date"}
        </p>
      </div>
    </div>
  );
};

export default TaskItem;
