import React from "react";
import "../App.css";

export default function NavBar({ query, onQueryUpdate, movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <SearchBar query={query} onQueryUpdate={onQueryUpdate} />
      <Results movies={movies} />
    </nav>
  );
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
    />
  );
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
