import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
   <div className="app-navbar">
  <div className="navbar-content">

    <div className="nav-left">
      <a className="nav-item-link" href="#">Profile</a>
    </div>

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

    <div className="nav-right">
      <a className="nav-item-link" href="#">+ Add Restaurant</a>
    </div>

    <div className="nav-right">
     <button className="btn btn-outline-dark">Login</button>
    </div>

  </div>
</div>
    
  );
};

export default Navbar;

