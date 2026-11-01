
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
      const response = await fetch(
        `/api/movies?page=${pageNumber}`
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      if (!data.movies?.length) {
        setError("No more movies available.");
        return;
      }

      setMovies((previous) => [
        ...previous,
        ...data.movies
      ]);

      setPage(pageNumber);
    } catch {
      setError("Unable to load movies. Please try again.");
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
      return;
    }

    await loadPage(page + 1);
    setIndex((current) => current + 1);
  }

  function previousMovie() {
    if (index > 0) {
      setIndex(index - 1);
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

      {loading && !movie && <h2>Loading movies...</h2>}

      {movie && (
        <>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "250px",
                maxWidth: "90%",
                borderRadius: "12px"
              }}
            />
          )}

          <h2>{movie.title}</h2>
          <p>Release date: {movie.release_date}</p>
          <p>Rating: ⭐ {movie.vote_average?.toFixed(1)}/10</p>

          <p style={{ maxWidth: "600px", margin: "20px auto" }}>
            {movie.overview}
          </p>

          <button onClick={previousMovie} disabled={index === 0}>
            Previous
          </button>

          {" "}

          <button onClick={nextMovie} disabled={loading}>
            {loading ? "Loading..." : "Next"}
          </button>

          <p>Movie {index + 1}</p>
        </>
      )}

      {error && <p>{error}</p>}

      <p style={{ fontSize: "12px", marginTop: "35px" }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </main>
  );
}
