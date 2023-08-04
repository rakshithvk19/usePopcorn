import { useState } from "react";
import React from "react";
import "../App.css";

export default function MovieList({ movies }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <Btn isOpen1={isOpen1} setIsOpen1={setIsOpen1} />
      {isOpen1 && (
        <ul className="list">
          {movies?.map((movie) => (
            <MovieEl movie={movie} key={movie.imdbID} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Btn({ isOpen1, setIsOpen1 }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen1((open) => !open)}>
      {isOpen1 ? "–" : "+"}
    </button>
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
