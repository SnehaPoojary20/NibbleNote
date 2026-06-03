import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import "../Restuarant/Restaurant.css";
import "./SearchResults.css";

const SearchResults = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/restaurants/search?q=${encodeURIComponent(query)}`
        );

        setRestaurants(res.data.results || []);
      } catch (err) {
        console.error("Search failed", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h2>Search Results</h2>
        <p>
          Showing results for:
          <span>"{query}"</span>
        </p>
      </div>

      {loading ? (
        <div className="search-loading">
          <p>Loading restaurants...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="empty-results">
          <h3>No restaurants found 🍜</h3>
          <p>Try searching another cuisine or place</p>
        </div>
      ) : (
        <>
          <p className="result-count">
            {restaurants.length} result(s) found
          </p>

          <div className="restaurant-grid">
            {restaurants.map((r) => (
              <div
                key={r._id}
                className="restaurant-card"
                onClick={() => navigate(`/restaurants/${r._id}`)}
              >
                <img src={r.image} alt={r.name} />

                <div className="card-overlay">
                  <h3>{r.name}</h3>

                  <p>{r.cuisine}</p>

                  <div className="search-rating">
                    ⭐ {r.avgRating?.toFixed(1) || "0.0"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;