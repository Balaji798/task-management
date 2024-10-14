import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the User interface that extends mongoose's Document
export interface ITask extends Document {
  adminId:ObjectId;
  userId: ObjectId;
  assign_to:String;
  task_name: string;
  due_date: Date;
  status: string;
}

// Create the user schema
const taskSchema: Schema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.ObjectId, ref: "Admin" },
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    assign_to:{type:String},
    task_name: { type: String, required: true },
    due_date: { type: Date, required: true },
    status: { type: String },
  },
  { timestamps: true }
);

// Export the mongoose model with the IUser interface
const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
