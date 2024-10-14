import { Button, Modal } from "antd";
import { useFormik } from "formik";
import { TaskSchema } from "../utils/validation";
import { useState } from "react";
import axios from "axios";
import { useUserTask } from "../Context/UserTaskContext";

interface TaskModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (action: boolean) => void;
  title: string;
}
const TaskModal: React.FC<TaskModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  title,
}) => {
  const { setTotalTask, totalTask, activeUser,setTaskCount,taskCount } = useUserTask();
  const [error, setError] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      userId:"",
      assign_to: "",
      task_name: "",
      due_date: "",
      status: "",
    },
    validationSchema: TaskSchema,
    onSubmit: async (values) => {
      try {
        const user = localStorage.getItem("adminToken");
        console.log(user);
        const config = {
          headers: {
            Authorization: `Bearer ${user}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        };
        const { data: res } = await axios.post(
          "http://localhost:8080/task/add_task",
          values,
          config
        );
        console.log(res.data);
        if (res.status) {
          setTotalTask([...totalTask, res.data]);
          setIsModalOpen(false);
          setTaskCount(taskCount+1)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }
    },
  });

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={() => {
        setIsModalOpen(false);
      }}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => formik.handleSubmit()}
        >
          Submit
        </Button>,
      ]}
    >
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Task Name</label>
          <input
            type="text"
            placeholder="Task Name"
            name="task_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.task_name}
            className="input"
          />
          {formik.touched.task_name && formik.errors.task_name ? (
            <div className="error_msg">{formik.errors.task_name}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Assign To</label>
          <input
            list="users"  // Linking input to the datalist with id 'users'
            placeholder="Assign To"
            name="assign_to"
            onChange={(e) => {
                formik.handleChange(e); // Update the assign_to value
        
                const selectedUser = activeUser.find(
                  (user) => `${user.firstName} ${user.lastName}` === e.target.value
                );
                if (selectedUser) {
                  formik.setFieldValue("userId", selectedUser._id); // Set userId based on the selected user
                }
              }}
            onBlur={formik.handleBlur}
            value={formik.values.assign_to}
            className="input"
          />
          <datalist id="users">
            {activeUser.map((user) => (
              <option key={user._id} value={`${user?.firstName} ${user?.lastName}`} /> // Display user names as options
            ))}
          </datalist>
          {formik.touched.assign_to && formik.errors.assign_to ? (
            <div className="error_msg">{formik.errors.assign_to}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Due Date</label>
          <input
            type="date"
            placeholder="Due Date"
            name="due_date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.due_date}
            className="input"
          />
          {formik.touched.due_date && formik.errors.due_date ? (
            <div className="error_msg">{formik.errors.due_date}</div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Status</label>
          <input
            type="text"
            placeholder="Status"
            name="status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.status}
            className="input"
          />
          {formik.touched.status && formik.errors.status ? (
            <div className="error_msg">{formik.errors.status}</div>
          ) : null}
        </div>
        {error !== "" && <div className="error_msg">{error}</div>}
      </div>
    </Modal>
  );
};

export default TaskModal;
