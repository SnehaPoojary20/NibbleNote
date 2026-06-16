import { useState } from "react";
import "./AddRestaurant.css";
import api from "../../api/axios";

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
    lat: "",
    lng: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    // Frontend validation before sending
    if (!formData.image) {
      setError("Please upload a restaurant image");
      return;
    }

    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);

    if (formData.lat === "" || isNaN(latNum)) {
      setError("Please enter a valid latitude (e.g. 19.0760)");
      return;
    }
    if (formData.lng === "" || isNaN(lngNum)) {
      setError("Please enter a valid longitude (e.g. 72.8777)");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("address", formData.address.trim());
    data.append("cuisine", formData.cuisine.trim());
    data.append("lat", String(latNum));
    data.append("lng", String(lngNum));
    data.append("image", formData.image);

  console.log("Submitting FormData:", {
  name: formData.name,
  address: formData.address,
  cuisine: formData.cuisine,
  lat: latNum,
  lng: lngNum,
  image: formData.image?.name,
});

    try {
      setLoading(true);

      const res = await api.post("/restaurants", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Restaurant added successfully ✅");

      setFormData({
        name: "",
        address: "",
        cuisine: "",
        lat: "",
        lng: "",
        image: null,
      });
      setPreview(null);

    } catch (err) {
      console.error("Add restaurant failed:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to add restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-restaurant">
      <h1>Add Restaurant</h1>

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

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {preview && (
            <img
              src={preview}
              alt="Restaurant Preview"
              className="image-preview"
            />
          )}

          
          {error && <p className="form-error">⚠ {error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Restaurant"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;