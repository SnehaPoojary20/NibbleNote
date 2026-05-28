import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./RestaurantDetail.css";

const RestaurantDetail = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  // Load restaurant + reviews
  const loadData = async () => {
    try {
      const restaurantRes = await api.get(
        `/restaurants/${id}`
      );

      setRestaurant(restaurantRes.data.data);

      const reviewRes = await api.get(
        `/reviews/restaurant/${id}`
      );

      setReviews(
        Array.isArray(reviewRes.data.data)
          ? reviewRes.data.data
          : []
      );

    } catch (err) {
      console.error("Load failed", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Submit review
  const handleSubmitReview = async () => {

    if (!newReview.trim()) return;

    try {

      await api.post("/reviews", {
        restaurantId: id,
        comment: newReview,
        rating,
      });

      // reload latest data
      await loadData();

      // reset form
      setNewReview("");
      setRating(5);

    } catch (err) {

      console.log(
        "Review failed:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
        "Review failed"
      );
    }
  };

  // Loading state
  if (!restaurant) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="restaurant-detail">

      {/* HERO IMAGE */}
      <div className="hero">

        <img
          src={restaurant.image}
          alt={restaurant.name}
        />

        <div className="overlay" />

        <div className="hero-content">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisine}</p>
        </div>

      </div>

      {/* INFO CARD */}
      <div className="info-card">

        <div className="rating">
          ⭐ {restaurant.avgRating?.toFixed(1) || "0.0"}

          <span>
            {" "}
            ({restaurant.totalReviews || 0} reviews)
          </span>
        </div>

        <p>
          <strong>📍 Address:</strong>{" "}
          {restaurant.address}
        </p>

      </div>

      {/* ADD REVIEW */}
      <div className="add-review">

        <h2>Write a Review</h2>

        <textarea
          placeholder="Share your experience..."
          value={newReview}
          onChange={(e) =>
            setNewReview(e.target.value)
          }
        />

        <div className="review-actions">

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>

          <button onClick={handleSubmitReview}>
            Post Review
          </button>

        </div>

      </div>

      {/* REVIEWS LIST */}
      <div className="reviews-section">

        <h2>All Reviews</h2>

        {reviews.length === 0 ? (

          <p className="no-reviews">
            No reviews yet
          </p>

        ) : (

          reviews.map((review) => (
            <div
              key={review._id}
              className="review-card"
            >

              <div className="review-header">

                <span>
                  ⭐ {review.rating}
                </span>

                <span>
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

              <p>{review.comment}</p>

            </div>
          ))

        )}

      </div>

    </div>
  );
};

export default RestaurantDetail;


