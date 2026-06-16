import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const images = [
  "/images/pizza.jpeg",
  "/images/biryani.jpeg",
  "/images/cake.jpeg",
  "/images/burger.jpeg",
  "/images/dinner.jpeg",
  "/images/icecream.jpeg",
  "/images/vadapav.jpeg",
  "/images/cholebhature.jpeg",
];

const Home = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate(); // ✅ was missing

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="hero">
        <div
          className="slider"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
        <h1>Discover. Taste. Remember</h1>
      </section>

      <section className="about">
        <h2>Why NibbleNote?</h2>
        <p>
          NibbleNote helps food lovers discover honest reviews, hidden gems,
          and remember every great bite through personal food journals.
        </p>
      </section>

      <section className="trending">
        <h2>Trending Near You 🔥</h2>
        <div className="food-grid">
          <div className="food-card">
            <img src="/images/pizza.jpeg" alt="Pizza" />
            <div className="food-info">
              <h3>Cheese Burst Pizza</h3>
              <p>⭐ 4.8 • Italian</p>
            </div>
          </div>
          <div className="food-card">
            <img src="/images/biryani.jpeg" alt="Biryani" />
            <div className="food-info">
              <h3>Hyderabadi Biryani</h3>
              <p>⭐ 4.9 • Mughlai</p>
            </div>
          </div>
          <div className="food-card">
            <img src="/images/cake.jpeg" alt="Cake" />
            <div className="food-info">
              <h3>Chocolate Lava Cake</h3>
              <p>⭐ 4.7 • Dessert</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Explore Categories</h2>
        <div className="category-container">
          <div className="category-card">🍕 Pizza</div>
          <div className="category-card">🍔 Burgers</div>
          <div className="category-card">🍜 Asian</div>
          <div className="category-card">🍰 Desserts</div>
          <div className="category-card">☕ Cafes</div>
          <div className="category-card">🌮 Street Food</div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📍 Hidden Gems</h3>
          <p>Find underrated restaurants and local favorites.</p>
        </div>
        <div className="feature-card">
          <h3>📝 Food Journals</h3>
          <p>Save and remember your best food experiences.</p>
        </div>
        <div className="feature-card">
          <h3>⭐ Honest Reviews</h3>
          <p>Discover real opinions from passionate food lovers.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Start Your Food Journey Today 🍴</h2>
        <button onClick={() => navigate("/register")}>Join Now</button>
      </section>
    </>
  );
};

export default Home;


