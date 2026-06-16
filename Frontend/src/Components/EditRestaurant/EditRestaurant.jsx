import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditRestaurant.css";
import api from "../../api/axios";

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
    lat: "",
    lng: "",
    image: null,
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const res = await api.get(`/restaurants/${id}`);
        const r = res.data.data;

        setFormData({
          name: r.name || "",
          address: r.address || "",
          cuisine: r.cuisine || "",
          lat: r.coordinates?.lat?.toString() || "",
          lng: r.coordinates?.lng?.toString() || "",
          image: null,
        });

        setCurrentImage(r.image || null);
      } catch (err) {
        console.error("Failed to load restaurant:", err);
        setError("Failed to load restaurant details");
      } finally {
        setFetching(false);
      }
    };

    loadRestaurant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);

    if (formData.lat === "" || isNaN(latNum)) {
      setError("Please enter a valid latitude");
      return;
    }
    if (formData.lng === "" || isNaN(lngNum)) {
      setError("Please enter a valid longitude");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("address", formData.address.trim());
    data.append("cuisine", formData.cuisine.trim());
    data.append("coordinates[lat]", String(latNum));
    data.append("coordinates[lng]", String(lngNum));

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      setLoading(true);

      await api.put(`/restaurants/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Restaurant updated successfully ✅");
      navigate(`/restaurants/${id}`);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update restaurant");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="edit-loading">Loading...</p>;
  if (error && !formData.name) return <p className="edit-error">{error}</p>;

  return (
    <div className="edit-restaurant">
      <h1>Edit Restaurant</h1>

      <div className="restaurant-form-container">
        <form className="restaurant-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cuisine"
            placeholder="Cuisine (e.g. Indian, Italian)"
            value={formData.cuisine}
            onChange={handleChange}
            required
          />

          <div className="coordinates">
            <input
              type="text"
              name="lat"
              placeholder="Latitude (e.g. 19.0760)"
              value={formData.lat}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lng"
              placeholder="Longitude (e.g. 72.8777)"
              value={formData.lng}
              onChange={handleChange}
              required
            />
          </div>

          <label className="image-label">
            Restaurant Image (leave empty to keep current)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="image-preview-row">
            {preview ? (
              <div className="preview-block">
                <p>New image:</p>
                <img src={preview} alt="New preview" className="image-preview" />
              </div>
            ) : currentImage ? (
              <div className="preview-block">
                <p>Current image:</p>
                <img src={currentImage} alt="Current" className="image-preview" />
              </div>
            ) : null}
          </div>

          {error && <p className="form-error">⚠ {error}</p>}

          <div className="edit-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Restaurant"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/restaurants/${id}`)}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditRestaurant;