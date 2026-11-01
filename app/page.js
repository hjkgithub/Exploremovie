
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => {
        if (!res.ok) throw new Error("Movie data unavailable");
        return res.json();
      })
      .then((data) => setMovies(data))
      .catch(() => setError("Could not load movies."))
      .finally(() => setLoading(false));
  }, []);

  const movie = movies[index];

  if (loading) return <h2>Loading movies...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!movie) return <h2>No movies found.</h2>;

  return (
    <main style={{
      background: "#111",
      color: "white",
      minHeight: "100vh",
      padding: "25px",
      textAlign: "center"
    }}>
      <h1>IMDb Movie Explorer</h1>

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

      <p>Release date: {movie.release_date || "Unknown"}</p>

      <p>Rating: ⭐ {movie.vote_average?.toFixed(1)}/10</p>

      <p style={{ maxWidth: "600px", margin: "20px auto" }}>
        {movie.overview}
      </p>

      <button
        onClick={() =>
          setIndex((index - 1 + movies.length) % movies.length)
        }
      >
        Previous
      </button>

      {" "}

      <button
        onClick={() =>
          setIndex((index + 1) % movies.length)
        }
      >
        Next
      </button>

      <p>Movie {index + 1} of {movies.length}</p>

      <p style={{ fontSize: "12px", marginTop: "35px" }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </main>
  );
}
