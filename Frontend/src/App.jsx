import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Components/Home/Home.jsx";
import AddRestaurant from "./Components/Restuarant/Restaurant.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Login from "./Components/Login/Login.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="add-restaurant" element={<AddRestaurant />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;


