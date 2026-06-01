// ========================================
// Favorites Page Entry
// Handles the saved-books experience:
// - reads favorites from localStorage
// - renders saved books into the Favorites page grid
// - removes books from favorites
// - keeps the UI synchronized after state changes
// ========================================

import { getFavorites } from "./storage.js";
import { removeFavorite } from "./modules/favorites.js";
import { renderBookGrid, renderStatus, setupNavbar, showToast, updateFavoritesCount } from "./ui.js";

// These containers are the only parts of the page that need dynamic updates.
const favoritesGrid = document.getElementById("favorites-grid");
const statusContainer = document.getElementById("status-container");

// Activate shared navbar behavior and mark Favorites as the current page.
setupNavbar("favorites");
updateFavoritesCount();

// Render the full Favorites page state from localStorage.
// This function is called on initial page load and again after removing a book,
// so the UI always reflects the latest saved favorites array.
function renderFavoritesPage() {
  const favorites = getFavorites();

  // If localStorage has no saved books, show a helpful empty state instead of an empty grid.
  if (!favorites.length) {
    favoritesGrid.innerHTML = "";
    renderStatus(statusContainer, "empty", "No favorite books yet. Add some from the Home page.");
    updateFavoritesCount();
    return;
  }

  // Clear any previous message and render cards using the shared UI helper.
  renderStatus(statusContainer, "");
  renderBookGrid(favoritesGrid, favorites, true);
  updateFavoritesCount();
}

// Event delegation for remove buttons:
// The grid may contain zero or many saved books, so one parent listener keeps
// the code simple and avoids attaching separate listeners to every card.
favoritesGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-btn");
  if (!button) return;

  // The button's data attribute identifies which saved book should be removed.
  const { bookKey } = button.dataset;

  // Update localStorage first, then rerender from storage so state and UI stay aligned.
  const result = removeFavorite(bookKey);
  if (result.wasRemoved) {
    showToast("Book removed from favorites.", "success");
  }
  renderFavoritesPage();
});

// Initial render when the Favorites page loads.
renderFavoritesPage();
