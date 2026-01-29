import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./Restaurant.css";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      const res = await api.get(
        `http://localhost:2000/api/v1/restaurants/${id}`
      );
      setRestaurant(res.data.data);
    };

    loadRestaurant();
  }, [id]);

  if (!restaurant) return <p className="loading">Loading...</p>;

  return (
    <div className="restaurant-detail">

      <img className="detail-img" src={restaurant.image} />

      <div className="detail-info">
        <h1>{restaurant.name}</h1>
        <p><strong>Location:</strong> {restaurant.address}</p>
        <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>

        <h3>Ratings & Reviews coming here ⭐</h3>
      </div>

    </div>
  );
};

export default RestaurantDetail;