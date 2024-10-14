import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

interface User {
  email:string;
  password:string
}
const Login: React.FC = () => {
  const [data, setData] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/user/login";
      const { data: res } = await axios.post(url, data);
      if (res.status) {
		  if (res.data.type === "user") {
			console.log(res.data.type === "user");
          localStorage.setItem("userToken", res.data.token);
          navigate("/");
        }
        if (res.data.type === "admin") {
          localStorage.setItem("adminToken", res.data.token);
          navigate("/admin");
        }
        // Using href for better compatibility
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Use `any` for error type as Axios errors can be diverse
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="login_container">
      <div className="login_form_container">
        <div className="left-login">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="green_btn-login">
              Sign In
            </button>
          </form>
        </div>
        <div className="right-signup">
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className="white_btn-login">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
