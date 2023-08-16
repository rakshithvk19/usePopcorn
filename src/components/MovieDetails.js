import { useState, useEffect } from "react";
import React from "react";
import "../App.css";

//CUSTOM-HOOKS
import { useKey } from "../customHooks/useKey";

//COMPONENTS
import Ratings from "./Ratings.js";
import { Loader } from "./Helper.js";

import { API_KEY } from "../config.js";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onError,
  watched,
  onWatchedMovie,
}) {
  const [movie, setMovie] = useState({});
  const [movieIsLoading, setMovieIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  //EFFECTS
  //Fetch movie details from the API and set state for movie that is to be displayed.
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovieDetails() {
        try {
          setMovieIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Something went wrong. Please try again");
          }

          data = await res.json();

          if (!data) {
            throw new Error("Something went wrong. Please try again");
          }
        } catch (e) {
          if (e.name !== "AbortError") onError(e.message);
          onError("");
        } finally {
          setMovieIsLoading(false);
          setMovie(data);
        }
      }
      fetchMovieDetails();

      return function () {
        controller.abort();
      };
    },
    [selectedId]
  );

  //Display movie title in the document header.
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "use-popcorn";
      };
    },
    [title]
  );

  //Custom-Hook to close Movie details on 'ESC'.
  useKey("Escape", onCloseMovie);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  let data = "";

  //Handler function for onClick.
  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: Number(runtime.split("").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
    };
    onWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      {movieIsLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Image of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <>
                  <p>
                    You have already watched the movie
                    {` and have rated ${watchedUserRating}🌟`}
                  </p>
                </>
              ) : (
                <Ratings maxRating={10} size={24} onSetRating={setUserRating} />
              )}
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddWatched}>
                  + Add to Watched List
                </button>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed By: {director}</p>
            <p>Genre: {genre}</p>
          </section>
        </>
      )}
    </div>
  );
}
