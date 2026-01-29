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

  if (!formData.image) {
    alert("Please upload a restaurant image");
    return;
  }

  const data = new FormData();
  data.append("name", formData.name);
  data.append("address", formData.address);
  data.append("cuisine", formData.cuisine);

  // backend expects nested coordinates
  data.append("coordinates[lat]", formData.lat);
  data.append("coordinates[lng]", formData.lng);

  // backend expects image field
  data.append("image", formData.image);

  try {
    setLoading(true);

    const res = await api.post("/restaurants", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Created:", res.data);

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
    alert(err.response?.data?.message || "Failed to add restaurant");
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
              type="number"
              name="lat"
              placeholder="Latitude"
              value={formData.lat}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="lng"
              placeholder="Longitude"
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

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;