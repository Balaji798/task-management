import { User } from "./User";

export interface Task {
    _id:string,
    adminId:string,
    assign_to:string,
    userId?: User;
    task_name: string;
    due_date: Date;
    status: "To Do" | "In Progress" | "Completed";
  }