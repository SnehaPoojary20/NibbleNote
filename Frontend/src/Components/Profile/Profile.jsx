import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        //  Load logged in user
        const res = await api.get("/users/me");
        setUser(res.data.data);

        //  Load user's reviews
        const reviewRes = await api.get(
          "/reviews/user"
        );
        const reviewList = Array.isArray(reviewRes.data.data)
        ? reviewRes.data.data
        : reviewRes.data.data.reviews || [];

        setReviews(reviewList);

        //  Load all restaurants
        const restRes = await api.get(
          "/restaurants"
        );

        //  ADD THIS LINE RIGHT HERE
        console.log("restaurants response:", restRes.data);

        //  Safe extraction (works with most API formats)
        const list = Array.isArray(restRes.data.data)
          ? restRes.data.data
          : restRes.data.data.restaurants || [];

        //  Only user's restaurants
        const mine = list.filter((r) => r.createdBy?.toString() === res.data.data._id?.toString());

        setRestaurants(mine);
      } catch (err) {
        console.error("Profile load failed:", err);
        navigate("/login");
      }
    };

    loadProfile();
  }, [navigate]);

  const handleProfilePicChange = async (e) => {
    const data = new FormData();
    data.append("profilePic", e.target.files[0]);

    await api.put("/users/update-profile-pic", data, {
  headers: { "Content-Type": "multipart/form-data" },
});
    window.location.reload();
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">

      <div className="profile-card">
        <img src={user.profilePic} className="profile-pic" />
        <br></br><br></br>
        
        <button className="change-pic">
          Change Photo
          <input type="file" hidden onChange={handleProfilePicChange} />
        </button>
        <br></br><br></br>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      <div className="profile-section">
        <h3>Your Restaurants</h3>

        {restaurants.length === 0 && <p>No restaurants added yet</p>}

        <div className="grid">
          {restaurants.map((r) => (
            <div key={r._id} className="mini-card">
              <img src={r.image} />
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
            <strong>{rev.restaurantId.name}</strong>
            <span>⭐ {rev.rating}</span>
            <p>{rev.comment}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;



