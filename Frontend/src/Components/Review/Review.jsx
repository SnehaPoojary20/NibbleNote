import "./Review.css";

const Review = ({ reviews }) => {
  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>

      {reviews.length === 0 && (
        <p className="no-reviews">No reviews yet</p>
      )}

      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <strong>{review.userId?.username || "User"}</strong>
            <span>⭐ {review.rating}</span>
          </div>

          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Review;
