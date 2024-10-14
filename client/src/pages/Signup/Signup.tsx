import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import "./signup.css"
import axios from 'axios';
import { UserSchema } from '../../utils/validation';



const Signup: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      if (values.password === confirmPassword) {
        try {
          console.log("hii")
          const { data: res } = await axios.post(
            "http://localhost:8080/user/signup",
            values
          );
          console.log(res.data)
          if(res.status){
            localStorage.setItem("adminToken", res.data.token);
            window.location.href = "/admin";
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
      } else {
        setError("Passwords do not match");
      }
    },
  });

  return (
    <div className="signup_container">
      <div className="signup_form_container">
        <div className="left">
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="white_btn-login">
              Sign In
            </button>
          </Link>
        </div>
        <div className="right">
          <form className="form_container" onSubmit={formik.handleSubmit}>
            <h1>Create Account</h1>
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
            <input
              type="password"
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
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="green_btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
