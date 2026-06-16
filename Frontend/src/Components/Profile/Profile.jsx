import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [picLoading, setPicLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data.data);

        const reviewRes = await api.get("/reviews/user");
        const reviewList = Array.isArray(reviewRes.data.data)
          ? reviewRes.data.data
          : reviewRes.data.data?.reviews || [];
        setReviews(reviewList);

        const restRes = await api.get("/restaurants");
        const list = Array.isArray(restRes.data.data)
          ? restRes.data.data
          : restRes.data.data?.restaurants || [];

        const mine = list.filter(
          (r) => r.createdBy?.toString() === res.data.data._id?.toString()
        );
        setRestaurants(mine);

      } catch (err) {
        console.error("Profile load failed:", err);
        navigate("/login");
      }
    };

    loadProfile();
  }, [navigate]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("profilePic", file);

    try {
      setPicLoading(true);
      await api.put("/users/update-profile-pic", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Profile pic update failed:", err);
      alert(err.response?.data?.message || "Failed to update profile picture");
    } finally {
      setPicLoading(false);
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">

      <div className="profile-card">
        <img src={user.profilePic} className="profile-pic" alt={user.username} />
        <br /><br />

        
        <label className="change-pic">
          {picLoading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleProfilePicChange}
            disabled={picLoading}
          />
        </label>
        <br /><br />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      <div className="profile-section">
        <h3>Your Restaurants</h3>

        {restaurants.length === 0 && <p>No restaurants added yet</p>}

        <div className="grid">
          {restaurants.map((r) => (
            <div
              key={r._id}
              className="mini-card"
              onClick={() => navigate(`/restaurants/${r._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={r.image} alt={r.name} />
              <span>{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>Your Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet</p>}

        {reviews.map((rev) => (
          <div key={rev._id} className="review-card">
            <strong>{rev.restaurantId?.name || "Restaurant"}</strong>
            <span>⭐ {rev.rating}</span>
            <p>{rev.comment}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;


