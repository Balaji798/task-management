import { Button, Modal } from "antd";
import { useFormik } from "formik";
import { UserSchema } from "../utils/validation";
import { useState } from "react";
import axios from "axios";
import { useUserTask } from "../Context/UserTaskContext";

interface TaskModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (action: boolean) => void;
  title: string;
}
const UserModal: React.FC<TaskModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  title,
}) => {
  const {setActiveUser,setTotalUser,totalUser,activeUser} = useUserTask()
  const [error, setError] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      try {
        const user = localStorage.getItem("adminToken");
        const config = {
          headers: {
            Authorization: `Bearer ${user}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        };
        const { data: res } = await axios.post(
          "http://localhost:8080/user/add_user",
          values,
          config
        );
        console.log(res.data);
        if (res.status) {
          setActiveUser([...activeUser,res.data]);
          setTotalUser(totalUser+1)
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
        <div style={{display:"flex",flexDirection:"column"}}>
          <label>First Name</label>
          <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className="input"
            />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="error_msg">{formik.errors.firstName}</div>
          ) : null}
        </div>

        <div style={{display:"flex",flexDirection:"column"}}>
          <label>Last Name</label>
          <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className="input"
            />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="error_msg">{formik.errors.lastName}</div>
          ) : null}
        </div>

        <div style={{display:"flex",flexDirection:"column"}}>
          <label>Email</label>
          <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="input"
            />
          {formik.touched.email && formik.errors.email ? (
            <div className="error_msg">{formik.errors.email}</div>
          ) : null}
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
          <label>Password</label>
          <input
              type="text"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="input"
            />
          {formik.touched.password && formik.errors.password ? (
            <div className="error_msg">{formik.errors.password}</div>
          ) : null}
        </div>
        {error!=="" && <div className="error_msg">{error}</div>}
      </div>
    </Modal>
  );
};

export default UserModal;
