import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data.data);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={user.profilePic || "/default-avatar.png"}
          className="profile-pic"
          alt="Profile"
        />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;



