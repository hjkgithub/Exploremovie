"use client";

import { useState } from "react";

export default function Home() {
  const [id, setId] = useState("tt33318732");

  function nextMovie() {
    const randomNumber = Math.floor(
      Math.random() * 90000000
    ) + 10000000;

    setId("tt" + randomNumber);
  }

  return (
    <main style={{
      background: "#111",
      color: "white",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px"
    }}>
      <h1>IMDb Random ID</h1>

      <h2>{id}</h2>

      <button onClick={nextMovie}>
        Next Movie
      </button>

      <a
        href={`https://www.imdb.com/title/${id}/`}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#f5c518" }}
      >
        Open on IMDb
      </a>
    </main>
  );
          }
