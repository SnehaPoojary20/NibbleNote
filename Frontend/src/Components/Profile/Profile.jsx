import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //  Fetch logged-in user
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.data);
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  fetchProfile();
}, []);

  //  Upload profile picture
  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profilePic", image);

      const res = await api.put("/users/update-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // update UI instantly
      setUser(res.data.data);
      setImage(null);

    } catch (err) {
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
  return <div className="profile-loading">Loading profile...</div>;
}


  return (
    
  <div className="profile-page">
    
    {/* Profile Header */}
     <div className="profile-card">
      <img
        src={user.profilePic || "/default-avatar.png"}
        alt="Profile"
        className="profile-pic"
      />

      <h2>{user.username}</h2>
      <p>{user.email}</p>

      {/* Upload */}
      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          className="btn btn-primary mt-2"
          onClick={handleUpload}
          disabled={loading || !image}
        >
          {loading ? "Uploading..." : "Update Profile Picture"}
        </button>
      </div>

      {error && <p className="text-danger mt-2">{error}</p>}
    </div>

  </div>
);

  };

export default Profile;



