// ========================================
// Main Application Entry
// Handles the Home page experience:
// - initializes shared navigation behavior
// - fetches books from the Open Library API
// - renders search results into the book grid
// - connects favorite buttons to localStorage state
// ========================================

import { fetchBooksByTitle } from "./api/fetchBooks.js";
import { toggleFavorite } from "./modules/favorites.js";
import { renderBookGrid, renderStatus, setupNavbar } from "./ui.js";

// Cache important DOM elements once at the top of the file.
// This keeps later functions focused on behavior instead of repeatedly querying the page.
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const booksGrid = document.getElementById("books-grid");
const statusContainer = document.getElementById("status-container");

// currentBooks stores the latest API results in memory.
// When a favorite button is clicked, we use this array to find the full book object
// before saving it to localStorage.
let currentBooks = [];

// Highlight the current page and enable the mobile navigation toggle.
setupNavbar("home");

// Fetch and render books for the Home page.
// The UI intentionally moves through clear states:
// loading -> success with cards, empty results, or error feedback.
async function searchBooks(query) {
  renderStatus(statusContainer, "loading");
  booksGrid.innerHTML = "";

  try {
    // fetchBooksByTitle returns simplified book objects that are ready for rendering.
    const books = await fetchBooksByTitle(query);
    currentBooks = books;

    // Empty-state feedback helps users recover instead of staring at a blank grid.
    if (!books.length) {
      renderStatus(statusContainer, "empty", "No results found. Try another title.");
      return;
    }

    // Clear the loading message and render the latest search results.
    renderStatus(statusContainer, "");
    renderBookGrid(booksGrid, books);
  } catch (error) {
    // Keep API or network failures visible to the user while logging details in fetchBooks.js.
    renderStatus(statusContainer, "error", error.message);
  }
}

// Listen for search form submission.
// preventDefault stops the browser from reloading the page so JavaScript can
// fetch and render matching books dynamically.
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  await searchBooks(query);
});

// Event delegation:
// The book cards are created after the API request, so individual buttons do not
// exist when the page first loads. One listener on the grid can still catch
// clicks from any current or future favorite button inside it.
booksGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-btn");
  if (!button) return;

  // data-book-key links the clicked button back to its book object in currentBooks.
  const { bookKey } = button.dataset;
  const selectedBook = currentBooks.find((book) => book.key === bookKey);
  if (!selectedBook) return;

  // toggleFavorite updates localStorage, then we rerender so button labels/colors
  // immediately reflect the new favorite state.
  toggleFavorite(selectedBook);
  renderBookGrid(booksGrid, currentBooks);
});

// Initial content:
// Loading a default search gives the homepage useful content before the user types.
searchBooks("bestsellers");
