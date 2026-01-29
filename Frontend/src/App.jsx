import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Components/Home/Home.jsx";
import AddRestaurant from "./Components/AddRestaurant/AddRestaurant.jsx";
import Restaurant from "./Components/Restuarant/Restaurant.jsx"
import RestaurantDetail from "./Components/Restuarant/RestaurantDetail.jsx"
import Profile from "./Components/Profile/Profile.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx"

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;


