import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post(
        "/users/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.data.accessToken
      );

      navigate("/profile");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h2>Login</h2>

        <input
          name="email"
          type="text"
          placeholder="Email or Username"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        {error && (
          <p className="error-text">{error}</p>
        )}

        <button disabled={loading}>
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;





