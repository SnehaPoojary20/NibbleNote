import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from 'axios'
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Components/Home/Home.jsx";
import AddRestaurant from "./Components/Restuarant/Restaurant.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Login from "./Components/Login/Login.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/login" element={<Login />} />
        <Route path="/apiadd-restaurant" element={<AddRestaurant />} />
        <Route path="/api/profile" element={<Profile />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;


