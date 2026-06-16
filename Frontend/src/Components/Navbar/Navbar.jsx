import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get("/users/me");
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
      await api.post("/users/logout");
    } catch (err) {
     console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="app-navbar">
      <div className="navbar-content">

        <Link className="nav-item-link brand" to="/">NibbleNote</Link>

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

        
        {user && (
          <Link className="nav-item-link" to="/add-restaurant">
            + Add
          </Link>
        )}

        {user && (
          <Link className="nav-item-link" to="/profile">
            Profile
          </Link>
        )}

        
        {!user ? (
          <>
            <Link className="nav-item-link" to="/login">Login</Link>
            <Link className="nav-item-link" to="/register">Register</Link>
          </>
        ) : (
          <button className="nav-item-link logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>
    </div>
  );
};

export default Navbar;



