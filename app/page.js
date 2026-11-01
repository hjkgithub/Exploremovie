
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPage(pageNumber) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/movies?page=${pageNumber}`);
      const data = await res.json();

      if (!res.ok || !data.movies) {
        throw new Error(data.error || "Movie loading failed");
      }

      if (data.movies.length === 0) {
        setError("No more movies available.");
        return false;
      }

      setMovies((old) => [...old, ...data.movies]);

      if (pageNumber === 1) {
        const randomIndex = Math.floor(
          Math.random() * data.movies.length
        );
        setIndex(randomIndex);
      }

      setPage(pageNumber);
      return true;

    } catch (err) {
      setError(err.message);
      return false;

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(1);
  }, []);

  async function nextMovie() {
    if (index === null) return;

    if (index + 1 < movies.length) {
      setIndex(index + 1);
    } else {
      const oldLength = movies.length;
      const success = await loadPage(page + 1);

      if (success) {
        setIndex(oldLength);
      }
    }
  }

  function previousMovie() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  const movie = index === null ? null : movies[index];

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "25px",
        textAlign: "center"
      }}
    >
      <h1>IMDb Movie Explorer</h1>

      {loading && !movie && <h2>Loading movies...</h2>}

      {error && <p>{error}</p>}

      {movie && (
        <>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/500x750/222/fff?text=No+Poster"
            }
            alt={movie.title}
            style={{
              width: "250px",
              maxWidth: "90%",
              borderRadius: "12px"
            }}
          />

          <h2>{movie.title}</h2>

          <p>
            Release date: {movie.release_date || "Unknown"}
          </p>

          <p>
            Rating: {movie.vote_average?.toFixed(1)}/10
          </p>

          <p>{movie.overview}</p>

          <button
            disabled={index === 0}
            onClick={previousMovie}
          >
            Previous
          </button>

          {" "}

          <button
            disabled={loading}
            onClick={nextMovie}
          >
            Next
          </button>

          <p>Movie number: {index + 1}</p>
        </>
      )}

      <p style={{ fontSize: "12px" }}>
        This product uses the TMDB API but is not endorsed
        or certified by TMDB.
      </p>
    </main>
  );
}
