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
    <>
     // Hero section
      <section className="hero">
        <div
          className="slider"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
        <h1>Discover. Taste. Remember</h1>
      </section>

      // about section
      <section className="about">
        <h2>Why NibbleNote?</h2>
        <p>
          NibbleNote helps food lovers discover honest reviews, hidden gems,
          and remember every great bite through personal food journals.
        </p>
      </section>
    </>
  );
};

export default Home;

