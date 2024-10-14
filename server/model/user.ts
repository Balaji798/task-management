import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the User interface that extends mongoose's Document
export interface IUser extends Document {
  _id: ObjectId;
  adminId: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Create the user schema
const userSchema: Schema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.ObjectId, ref: "Admin", required: true },
    firstName: { type: String, required: true },
    lastName: {
      type: String,
      required: [true, "Full name is required"],
      maxLength: [30, "Full name should be less than 30 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/, "Invalid email id"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// Export the mongoose model with the IUser interface
const User = mongoose.model<IUser>("User", userSchema);
export default User;
