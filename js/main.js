// Home page entry: search books, render results, and handle favorite actions.

import { fetchBooksByTitle } from "./api/fetchBooks.js";
import { addFavorite, removeFavorite } from "./modules/favorites.js";
import { renderBookGrid, renderStatus, setupNavbar, showToast, updateFavoritesCount } from "./ui.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const booksGrid = document.getElementById("books-grid");
const statusContainer = document.getElementById("status-container");

let currentBooks = [];

setupNavbar("home");
updateFavoritesCount();

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

    renderStatus(statusContainer, "");
    renderBookGrid(booksGrid, books);
  } catch (error) {
    renderStatus(statusContainer, "error", error.message);
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  await searchBooks(query);
});

// Event delegation handles favorite buttons rendered after API results load.
booksGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-btn");
  if (!button) return;

  const { bookKey } = button.dataset;
  const selectedBook = currentBooks.find((book) => book.key === bookKey);
  if (!selectedBook) return;

  const { favoriteAction } = button.dataset;
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

  renderBookGrid(booksGrid, currentBooks);
  updateFavoritesCount();
});

searchBooks("bestsellers");
