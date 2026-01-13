import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div
        className="slider"
        style={{ backgroundImage: `url(${images[index]})` }}
      ></div>

      <h1>Discover. Taste. Remember</h1>
    </div>
  );
};

export default Home;
