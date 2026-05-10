import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const [query, setQuery] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
        localStorage.removeItem("token");
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");

      localStorage.removeItem("token");
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSearch = (e) => {
  e.preventDefault();

  if (!query.trim()) return;

  navigate(`/search?q=${query}`);
};

  return (
    <div className="app-navbar">
      <div className="navbar-content">

        <Link className="nav-item-link" to="/">Home</Link>

        {user && (
          <Link className="nav-item-link" to="/profile">
            Profile
          </Link>
        )}

        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="form-control"
            type="search"
            placeholder="Search places, cuisines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-dark">
           Discover
        </button>
        </form>

        <Link className="nav-item-link" to="/restaurants">Restaurants</Link>
        <Link className="nav-item-link" to="/add-restaurant">+ Add Restaurant</Link>

        {!user ? (
          <>
            <Link className="nav-item-link" to="/login">Login</Link>
            <Link className="nav-item-link" to="/register">Register</Link>
          </>
        ) : (
          <span className="nav-item-link logout-btn" onClick={handleLogout}>
            Logout
          </span>
        )}

      </div>
    </div>
  );
};

export default Navbar;



