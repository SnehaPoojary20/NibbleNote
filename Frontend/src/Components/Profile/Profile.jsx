import { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // 1. Get current user
      const userRes = await fetch("http://localhost:5000/api/users/me", {
        credentials: "include",
      });
      const userData = await userRes.json();
      setUser(userData.data);

      const userId = userData.data._id;

      // 2. Get restaurants added by user
      const resRes = await fetch(
        `http://localhost:5000/api/restaurants/user/${userId}`,
        { credentials: "include" }
      );
      const resData = await resRes.json();
      setRestaurants(resData.data || []);

      // 3. Get comments by user
      const comRes = await fetch(
        `http://localhost:5000/api/comments/user/${userId}`,
        { credentials: "include" }
      );
      const comData = await comRes.json();
      setComments(comData.data || []);
    } catch (error) {
      console.error("Profile fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-error">User not logged in</div>;
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-card">
        <img
          src={user.profilePic}
          alt="Profile"
          className="profile-pic"
        />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      {/* Restaurants */}
      <section className="profile-section">
        <h3>Restaurants Added</h3>

        {restaurants.length === 0 ? (
          <p className="empty-text">No restaurants added yet</p>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((res) => (
              <div key={res._id} className="restaurant-card">
                <img src={res.image} alt={res.name} />
                <h4>{res.name}</h4>
                <p>{res.cuisine}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comments */}
      <section className="profile-section">
        <h3>My Comments</h3>

        {comments.length === 0 ? (
          <p className="empty-text">No comments yet</p>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <p>{comment.text}</p>
                <span>on {comment.restaurant?.name}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;

