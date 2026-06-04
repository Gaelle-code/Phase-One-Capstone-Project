/**
 * Main entry point for the Home page.
 * Coordinates book searching, result rendering, and favorite status management.
 */

import { fetchBooksByTitle } from "./api/fetchBooks.js";
import { addFavorite, removeFavorite } from "./modules/favorites.js";
import { renderBookGrid, renderStatus, setupNavbar, showToast, updateFavoritesCount } from "./ui.js";

// --- DOM Elements ---
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const booksGrid = document.getElementById("books-grid");
const statusContainer = document.getElementById("status-container");

/** @type {Array<Object>} Internal state to track current search results for UI synchronization */
let currentBooks = [];

// Initialize application state and UI components
setupNavbar("home");
updateFavoritesCount();

/**
 * Orchestrates the book search workflow: updates UI state, fetches data, and handles edge cases.
 * @param {string} query - The search term entered by the user.
 */
async function searchBooks(query) {
  renderStatus(statusContainer, "loading");
  booksGrid.innerHTML = "";

  try {
    const books = await fetchBooksByTitle(query);
    currentBooks = books;

    if (!books.length) {
      renderStatus(statusContainer, "empty", "No results found. Try another title.");
      return;
    }

    renderStatus(statusContainer, ""); // Clear status messages
    renderBookGrid(booksGrid, books);
  } catch (error) {
    renderStatus(statusContainer, "error", error.message);
  }
}

// Handle search form submissions
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  await searchBooks(query);
});

/**
 * Event Delegation: Monitors clicks on the books grid to handle favorite toggling.
 * This approach is more memory-efficient than attaching listeners to each card.
 */
booksGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-btn");
  if (!button) return;

  const { bookKey } = button.dataset;
  const selectedBook = currentBooks.find((book) => book.key === bookKey);
  if (!selectedBook) return;

  const { favoriteAction } = button.dataset;
  
  // Logic for adding/removing favorites with feedback
  if (favoriteAction === "remove") {
    const result = removeFavorite(selectedBook.key);
    if (result.wasRemoved) {
      showToast("Book removed from favorites.", "success");
    }
  } else {
    const result = addFavorite(selectedBook);
    if (result.wasAdded) {
      showToast("Book added to favorites successfully.", "success");
    } else if (result.alreadyExists) {
      showToast("This book is already in your favorites.", "info");
    }
  }

  // Synchronize UI after state change
  renderBookGrid(booksGrid, currentBooks);
  updateFavoritesCount();
});

// Load initial content on application start
searchBooks("bestsellers");
