
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const key = process.env.TMDB_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "API key missing" },
        { status: 500 }
      );
    }

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=${page}`;

    const response = await fetch(url, {
      cache: "no-store"
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.status_message || "TMDB error" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      movies: data.results,
      page: data.page,
      total_pages: data.total_pages
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
