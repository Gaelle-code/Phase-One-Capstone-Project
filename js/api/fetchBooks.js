// ========================================
// Open Library API Module
// Responsible for:
// - building search requests
// - fetching book data asynchronously
// - handling API/network errors safely
// - transforming raw API results into simple objects the UI can render
// ========================================

const BASE_URL = "https://openlibrary.org/search.json?q=";

// Convert one raw Open Library result into the smaller shape our app needs.
// Keeping this transformation here prevents UI files from depending on the
// API's original field names such as author_name, first_publish_year, and cover_i.
function formatBook(book) {
  return {
    key: book.key || `fallback-${book.title || Math.random()}`,
    title: book.title || "Untitled Book",
    author: book.author_name?.[0] || "Unknown Author",
    publishYear: book.first_publish_year || "N/A",
    coverId: book.cover_i || null,
  };
}

// Fetch book data asynchronously from Open Library.
// try/catch keeps the app from crashing if the request fails, and the thrown
// user-friendly error message is displayed by main.js.
export async function fetchBooksByTitle(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    // encodeURIComponent makes titles like "Harry Potter" or "C# basics" safe for URLs.
    const response = await fetch(`${BASE_URL}${encodeURIComponent(cleanQuery)}`);

    // fetch only rejects on network errors, so we manually handle bad HTTP responses.
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Limit results to keep rendering fast and the page approachable for beginners.
    return (data.docs || []).slice(0, 24).map(formatBook);
  } catch (error) {
    console.error("Error while fetching books:", error);
    throw new Error("Unable to fetch books right now. Please try again.");
  }
}
