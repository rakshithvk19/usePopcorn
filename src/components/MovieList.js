import { useState } from "react";
import React from "react";
import "../App.css";

export default function Box({ movies }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Btn isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && (
        <ul className="list">
          {movies?.map((movie) => (
            <MovieEl movie={movie} key={movie.imdbID} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MovieEl({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
