/**
 * API Service Layer for interacting with the Open Library Search API.
 */

const BASE_URL = "https://openlibrary.org/search.json?q=";

/**
 * Normalizes raw API data into a predictable application-specific book object.
 * This decouples the UI from changes in the external API response structure.
 * @arg {Object} book - The raw book record from Open Library.
 * @returns {Object} A sanitized book object.
 */
function formatBook(book) {
  return {
    key: book.key || `fallback-${book.title || Math.random()}`,
    title: book.title || "Untitled Book",
    author: book.author_name?.[0] || "Unknown Author",
    publishYear: book.first_publish_year || "N/A",
    coverId: book.cover_i || null,
  };
}

/**
 * Executes a search query against the Open Library API.
 * Includes sanitization, error handling, and result limiting.
 * @arg {string} query - The search query.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of formatted books.
 */
export async function fetchBooksByTitle(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const response = await fetch(`${BASE_URL}${encodeURIComponent(cleanQuery)}`);

    if (!response.ok) {
      throw new Error(`API error: Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Map and limit results to maintain UI performance and layout consistency
    return (data.docs || []).slice(0, 24).map(formatBook);
  } catch (error) {
    console.error("[fetchBooksByTitle] Failure:", error);
    throw new Error("Unable to fetch books right now. Please check your connection and try again.");
  }
}
