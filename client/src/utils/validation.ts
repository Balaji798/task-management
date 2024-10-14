import * as Yup from "yup";

export const UserSchema = Yup.object().shape({
  _id: Yup.string(),
  firstName: Yup.string().required("First is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Priority is required"),
});

export const TaskSchema = Yup.object().shape({
  _id: Yup.string(),
  adminId: Yup.string(),
  userId: Yup.string(),
  assign_to: Yup.string().required("User required"),
  task_name: Yup.string().required("Task name is required"),
  due_date: Yup.date().required("Due Date required"),
  status: Yup.string(),
});
