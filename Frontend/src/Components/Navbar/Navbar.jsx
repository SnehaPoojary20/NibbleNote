import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="app-navbar">
      <div className="navbar-content">

        {/* LEFT */}
        <div className="nav-left">
          <a className="nav-item-link" href="#">Profile</a>
        </div>

        {/* CENTER */}
        <form className="search-form">
          <input
            className="form-control"
            type="search"
            placeholder="Search places, cuisines..."
          />
          <button className="btn btn-outline-dark">
            Discover
          </button>
        </form>

        {/* RIGHT */}
        <div className="nav-actions">
          <a className="nav-item-link" href="#">Restaurants</a>
          <a className="nav-item-link" href="#">+ Add Restaurant</a>
          <button className="btn btn-outline-dark">Login</button>
          <button className="btn btn-outline-dark">Logout</button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;


