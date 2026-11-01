import { NextResponse } from "next/server";

export async function GET() {
  try {
    const key = process.env.TMDB_API_KEY;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch movies" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
  movies: data.results,
  page: data.page,
  total_pages: data.total_pages
});

    
}
