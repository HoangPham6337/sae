import React, { useState, useEffect } from "react";
import "./Carousel.css";

function Carousel({ images, onGameSelect }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const autoPlay = setInterval(() => {
      slideRight();
    }, 2500);

    return () => clearInterval(autoPlay);
  }, [current]);

  const slideRight = () => {
    setCurrent((current + 1) % images.length);
  };

  const slideLeft = () => {
    setCurrent((current - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel">
      <div className="carousel_wrapper">
        {images.map((game, index) => (
          <div
            key={index}
            className={
              index === current
                ? "carousel_card carousel_card-active"
                : "carousel_card"
            }
            onClick={() => onGameSelect(game)} // Appel de onGameSelect lors du clic
          >
            <img
              className="card_image"
              src={game.cover.original} // Utilisation de cover.original
              alt={game.title}
            />
            <div className="card_overlay">
              <h2 className="card_title">{game.title}</h2>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel_arrow carousel_arrow_left" onClick={slideLeft}>
        &lsaquo;
      </button>
      <button className="carousel_arrow carousel_arrow_right" onClick={slideRight}>
        &rsaquo;
      </button>
      <div className="carousel_pagination">
        {images.map((_, dotIndex) => (
          <div
            key={dotIndex}
            className={
              dotIndex === current
                ? "pagination_dot pagination_dot-active"
                : "pagination_dot"
            }
            onClick={() => setCurrent(dotIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
