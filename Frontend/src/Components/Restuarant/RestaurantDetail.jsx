import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Review from "../Review/Review.jsx";
import "./RestaurantDetail.css";

const RestaurantDetail = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const restaurantRes = await api.get(`/restaurants/${id}`);
        setRestaurant(restaurantRes.data.data);

        const reviewRes = await api.get(`/reviews/restaurant/${id}`);
        setReviews(Array.isArray(reviewRes.data.data) ? reviewRes.data.data : []);
      } catch (err) {
        console.error("Load failed", err);
        setReviews([]);
      }
    };

    loadData();
  }, [id]);

  if (!restaurant) return <p className="loading">Loading...</p>;

  return (
    <div className="restaurant-detail">

      {/* IMAGE */}
      <div className="image-wrapper">
        <img
          src={`http://localhost:5000${restaurant.image}`}
          alt={restaurant.name}
        />
      </div>

      {/* INFO */}
      <div className="restaurant-info">
        <h1>{restaurant.name}</h1>

        <div className="rating">
          ⭐ {restaurant.avgRating?.toFixed(1) || "0.0"} / 5
          <span> ({restaurant.totalReviews || 0} reviews)</span>
        </div>

        <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
        <p><strong>Address:</strong> {restaurant.address}</p>
      </div>

      {/* REVIEWS */}
      <Review reviews={reviews} />

    </div>
  );
};

export default RestaurantDetail;


