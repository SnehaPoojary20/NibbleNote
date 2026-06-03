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
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUser(res.data.data))
      .catch(() => setCurrentUser(null));
  }, []);

  const loadData = async () => {
    try {
      const [restaurantRes, reviewRes] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/reviews/restaurant/${id}`),
      ]);

      setRestaurant(restaurantRes.data.data);
      setReviews(
        Array.isArray(reviewRes.data.data) ? reviewRes.data.data : []
      );
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!newReview.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to post a review");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        "/reviews",
        { restaurantId: id, comment: newReview, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadData();
      setNewReview("");
      setRating(5);
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setDeletingId(reviewId);
      await api.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (!restaurant) return <p className="loading">Loading...</p>;

  const alreadyReviewed = currentUser
    ? reviews.some(
        (r) => r.userId?._id?.toString() === currentUser._id?.toString()
      )
    : false;

  return (
    <div className="restaurant-detail">

      {/* HERO */}
      <div className="hero">
        <img src={restaurant.image} alt={restaurant.name} />
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
          <span> ({restaurant.totalReviews || 0} reviews)</span>
        </div>
        <p>
          <strong>📍 Address:</strong> {restaurant.address}
        </p>
      </div>

      {/* ADD REVIEW — only if logged in and hasn't reviewed yet */}
      {currentUser && !alreadyReviewed && (
        <div className="add-review">
          <h2>Write a Review</h2>

          <textarea
            placeholder="Share your experience..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />

          <div className="review-actions">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>

            <button onClick={handleSubmitReview} disabled={submitting}>
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </div>
      )}

      {/* Already reviewed notice */}
      {currentUser && alreadyReviewed && (
        <div className="add-review">
          <p style={{ color: "#888", fontStyle: "italic" }}>
             You've already reviewed this restaurant.
          </p>
        </div>
      )}

      {/* Not logged in notice */}
      {!currentUser && (
        <div className="add-review">
          <p style={{ color: "#888" }}>
            <a href="/login">Login</a> to write a review.
          </p>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="reviews-section">
        <h2>All Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="no-reviews">
            No reviews yet — be the first!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">

              <div className="review-header">
                <div className="review-user">
                  <strong>
                    {review.userId?.username || "Anonymous"}
                  </strong>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="review-rating">
                  {"⭐".repeat(review.rating)}
                  <span className="rating-num"> {review.rating}/5</span>
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>

              {/* Delete button — only for review owner */}
              {currentUser &&
                review.userId?._id?.toString() ===
                  currentUser._id?.toString() && (
                  <button
                    className="delete-review-btn"
                    onClick={() => handleDeleteReview(review._id)}
                    disabled={deletingId === review._id}
                  >
                    {deletingId === review._id ? "Deleting..." : "🗑 Delete"}
                  </button>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;


