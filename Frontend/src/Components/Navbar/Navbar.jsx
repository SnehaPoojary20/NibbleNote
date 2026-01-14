import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
   <div className="app-navbar">
  <div className="navbar-content">

    <Link className="nav-item-link" to="/profile">Profile</Link>

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

    <button className="btn btn-outline-dark">Login</button>

  </div>
</div>

  );
};

export default Navbar;





