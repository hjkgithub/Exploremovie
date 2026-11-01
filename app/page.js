
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
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
        return;
      }

      setMovies((old) => [...old, ...data.movies]);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(1);
  }, []);

  async function nextMovie() {
    if (index + 1 < movies.length) {
      setIndex(index + 1);
    } else {
      const oldLength = movies.length;
      await loadPage(page + 1);
      setIndex(oldLength);
    }
  }

  const movie = movies[index];

  return (
    <main style={{
      background: "#111",
      color: "white",
      minHeight: "100vh",
      padding: "25px",
      textAlign: "center"
    }}>
      <h1>IMDb Movie Explorer</h1>

      {loading && !movie && <h2>Loading...</h2>}

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
          <p>Release date: {movie.release_date || "Unknown"}</p>
          <p>Rating: {movie.vote_average?.toFixed(1)}/10</p>
          <p>{movie.overview}</p>

          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            Previous
          </button>

          {" "}

          <button disabled={loading} onClick={nextMovie}>
            Next
          </button>

          <p>Movie number: {index + 1}</p>
        </>
      )}

      <p style={{ fontSize: "12px" }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </main>
  );
}
