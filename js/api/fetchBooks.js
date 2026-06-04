// Open Library API helpers.

const BASE_URL = "https://openlibrary.org/search.json?q=";

function formatBook(book) {
  return {
    key: book.key || `fallback-${book.title || Math.random()}`,
    title: book.title || "Untitled Book",
    author: book.author_name?.[0] || "Unknown Author",
    publishYear: book.first_publish_year || "N/A",
    coverId: book.cover_i || null,
  };
}

export async function fetchBooksByTitle(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const response = await fetch(`${BASE_URL}${encodeURIComponent(cleanQuery)}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return (data.docs || []).slice(0, 24).map(formatBook);
  } catch (error) {
    console.error("Error while fetching books:", error);
    throw new Error("Unable to fetch books right now. Please try again.");
  }
}
