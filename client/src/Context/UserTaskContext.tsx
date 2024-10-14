import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { Task } from "../types/Task";
import { User } from "../types/User";

// Define the types for the context state
interface UserTaskContextType {
  activeUser: User[];
  totalUser: number;
  totalTask: Task[];
  userTask:Task[];
  taskCount: number;
  userTaskCount:number;
  setActiveUser: React.Dispatch<React.SetStateAction<User[]>>;
  setUserTask: React.Dispatch<React.SetStateAction<Task[]>>;
  setTotalUser: React.Dispatch<React.SetStateAction<number>>;
  setTotalTask: React.Dispatch<React.SetStateAction<Task[]>>;
  setTaskCount: React.Dispatch<React.SetStateAction<number>>;
  setUserTaskCount: React.Dispatch<React.SetStateAction<number>>;
  fetchUserTasks: () => void;
}

// Create the context
const UserTaskContext = createContext<UserTaskContextType | undefined>(undefined);

// Provider component
export const UserTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<User[]>([]);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalTask, setTotalTask] = useState<Task[]>([]);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [userTask,setUserTask] = useState<Task[]>([]);
  const [userTaskCount, setUserTaskCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("userToken");

      try {
        if (adminToken) {
          await fetchAdminData(adminToken);
        } else if (userToken) {
          await fetchUserTasks();
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        window.location.href = "/login";
      }
    };

    fetchData();
  }, []);

  // Function to fetch admin-related data
  const fetchAdminData = async (adminToken: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    };

    // Fetch users
    const userResponse = await axios.get("http://localhost:8080/user/get_users", config);
    if (userResponse.status === 401) {
      window.location.href = "/login";
      return;
    }

    setActiveUser(userResponse.data.data);
    setTotalUser(userResponse.data.data.length);

    // Fetch tasks
    const taskResponse = await axios.get("http://localhost:8080/task/get_task", config);
    if (taskResponse.status === 403) {
      window.location.href = "/login";
      return;
    }

    setTotalTask(taskResponse.data.data);
    setTaskCount(taskResponse.data.data.length);
  };

  // Function to fetch user-specific tasks
  const fetchUserTasks = async () => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      window.location.href = "/login";
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    };

    // Fetch user's tasks
    const userTaskResponse = await axios.get("http://localhost:8080/task/get_user_task", config);
    if (userTaskResponse.status === 403) {
      window.location.href = "/login";
      return;
    }

    setUserTask(userTaskResponse.data.data);
    setUserTaskCount(userTaskResponse.data.data.length);
  };

  return (
    <UserTaskContext.Provider
      value={{
        activeUser,
        totalUser,
        totalTask,
        taskCount,
        setActiveUser,
        setTotalUser,
        setTotalTask,
        setTaskCount,
        fetchUserTasks,
        userTask,
        setUserTask,
        setUserTaskCount,
        userTaskCount
      }}
    >
      {children}
    </UserTaskContext.Provider>
  );
};

// Custom hook to use the context
export const useUserTask = () => {
  const context = useContext(UserTaskContext);
  if (!context) {
    throw new Error("useUserTask must be used within a UserTaskProvider");
  }
  return context;
};
