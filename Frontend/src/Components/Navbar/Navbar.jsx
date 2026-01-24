import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/me"); // backend route to get current user
        setUser(res.data.data);
      } catch (err) {
        setUser(null); // not logged in
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="app-navbar">
      <div className="navbar-content">

         <Link className="nav-item-link" to="/">Home</Link>

        {/* Profile link always shows if logged in */}
        {user && <Link className="nav-item-link" to="/profile">Profile</Link>}

      
        <form className="search-form">
          <input
            className="form-control"
            type="search"
            placeholder="Search places, cuisines..."
          />
          <button className="btn btn-outline-dark">Discover</button>
        </form>

        <Link className="nav-item-link" to="/restaurants">Restaurants</Link>
        <Link className="nav-item-link" to="/add-restaurant">+ Add Restaurant</Link>

        {/* Conditional login/register or logout */}
        {!user && (
          <>
            <Link className="nav-item-link" to="/login">Login</Link>
            <Link className="nav-item-link" to="/register">Register</Link>
          </>
        )}

        {user && (
          <span className="nav-item-link" style={{ cursor: "pointer" }} onClick={handleLogout}>
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;




