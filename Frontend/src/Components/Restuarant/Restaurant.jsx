import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Restaurant.css";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const loadRestaurants = async () => {
    try {
      const res = await api.get("/restaurants");

      console.log("restaurants response:", res.data); 

     setRestaurants(res.data.data || []);
    } catch (err) {
      console.error("Failed to load restaurants", err);
      setRestaurants([]); // prevent crash
    }
  };

  loadRestaurants();
}, []);

  return (
    <div className="restaurant-page">
      <h2 className="page-title">Explore Restaurants</h2>
        <p>Total restaurants: {restaurants.length}</p>
      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <div
            key={r._id}
            className="restaurant-card"
            onClick={() => navigate(`/restaurants/${r._id}`)}
          >
            <img src={r.image} alt={r.name} />
            <div className="card-overlay">
              <h3>{r.name}</h3>
              <p>{r.cuisine}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;

