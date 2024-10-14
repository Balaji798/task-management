import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Task from "./pages/task/Task";
import Users from "./pages/users/Users";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Header from "./components/header/Header";
import "./App.css"
import SideBar from "./components/sideBar/SideBar";
import AdminPanel from "./pages/adminPanel/AdminPanel";

const App = () => {
  const currentPath = window.location.pathname;
  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");

  console.log(currentPath);

  return (
    <Router>
      <div>
        {(userToken || adminToken) && (currentPath!=="/login"&& currentPath!=="/signup")&& <Header />}
        {(userToken || adminToken) && (currentPath!=="/login"&& currentPath!=="/signup") && <SideBar />}
      </div>
      <div
        style={{
          marginLeft: userToken || adminToken ? "14%" : "0",
          padding: "50px 0 0 20px",
          backgroundColor: "#f6f9fa",
        }}
      >
        <Routes>
          {userToken && <Route path="/" element={<Home />} />}
          {adminToken && <Route path="/admin" element={<AdminPanel />} />}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {userToken && <Route path="/task" element={<Task />} />}
          {userToken && <Route path="/users" element={<Users />} />}
          <Route path="*" element={<Navigate replace to={userToken ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
