import { useState, useEffect } from "react";
import React from "react";
import "../App.css";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    title: "Inception",
    year: "2010",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    title: "Back to the Future",
    year: "1985",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const APIKey = "475999e8";

//IMPORTING COMPONENTS.
// import NavBar from "./NavBar";
// import MovieList from "./MovieList";
// import WatchedList from "./WatchedList";
import Ratings from "./Ratings";

export default function App() {
  const [movies, setMovies] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("Intersteller");
  const [watched, setWatched] = useState(tempWatchedData);
  const [selectedId, setSelectedId] = useState(null);

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

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${APIKey}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error(
              "Something went wrong. Please check your interner connection."
            );
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error(data.Error);
          }
          setMovies(data.Search);
        } catch (e) {
          if (e.name !== "AbortError") setError(e.message);
          setError("");
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} onQueryUpdate={setQuery} />
        <Results movies={movies} />
      </NavBar>

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

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onError,
  onWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [movieIsLoading, setMovieIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

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

  //EFFECTS
  //Fetch movie details from the API and set state for movie that is to be displayed.
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovieDetails() {
        try {
          setMovieIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${APIKey}&i=${selectedId}`,
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

  //Close Movie details on 'ESC'.
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseMovie]
  );

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

function MovieSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          &times;
        </button>
      </div>
    </li>
  );
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

function MovieList({ movies, onSelectedMovie }) {
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

function Btn({ isOpen1, setIsOpen1 }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen1((open) => !open)}>
      {isOpen1 ? "–" : "+"}
    </button>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, onQueryUpdate }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onQueryUpdate(e.target.value)}
      onSubmit={(e) => onQueryUpdate(e.target.value)}
    />
  );
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong>
    </p>
  );
}
