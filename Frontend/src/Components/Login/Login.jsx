import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="name@example.com"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="form-control"
          aria-describedby="passwordHelpBlock"
        />
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8–20 characters long, contain letters and numbers,
          and must not contain spaces or special characters.
        </div>
      </div>
    </div>
  );
};

export default Login;

