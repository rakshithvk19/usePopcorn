import { useState } from "react";
import React from "react";
import "../App.css";

export default function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <MovieEl
          movie={movie}
          onSelectedMovie={onSelectedMovie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function MovieEl({ movie, onSelectedMovie }) {
  function handleMovieClick() {
    onSelectedMovie(movie.imdbID);
  }
  return (
    <li key={movie.imdbID} onClick={handleMovieClick}>
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
