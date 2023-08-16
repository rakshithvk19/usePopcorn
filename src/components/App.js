import { useState, useEffect, useRef } from "react";
import React from "react";
import "../App.css";

//IMPORTING COMPONENTS.
import NavBar from "./NavBar.js";
import MovieList from "./MovieList.js";
import MovieDetails from "./MovieDetails.js";
import { MovieSummary, WatchedMovieList } from "./WatchedList";
import { Loader } from "./Helper.js";

//CUSTOM-HOOKS.
import { useMovies } from "../customHooks/useMovies";
import { useLocalStorageState } from "../customHooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  //CUSTOM-HOOKS
  //To fetch value from Local-Storage API.
  const [watched, setWatched] = useLocalStorageState([], "watched");

  //To fetch movie data from the API with the query specified.
  const { movies, isLoading, error, setError } = useMovies(
    query,
    handleCloseMovie
  );

  //HANDLER-FUNCTIONS
  function handleSelectMovie(movieId) {
    setSelectedId(movieId);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar query={query} onQueryUpdate={setQuery} movies={movies} />

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onError={setError}
              onWatchedMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <MovieSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Btn isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

function Btn({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
