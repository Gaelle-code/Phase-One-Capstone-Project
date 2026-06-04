/**
 * Controller for the Favorites page.
 * Handles the display and management of user-saved books.
 */

import { getFavorites } from "./storage.js";
import { removeFavorite } from "./modules/favorites.js";
import { renderBookGrid, renderStatus, setupNavbar, showToast, updateFavoritesCount } from "./ui.js";

const favoritesGrid = document.getElementById("favorites-grid");
const statusContainer = document.getElementById("status-container");

// Initialize page components
setupNavbar("favorites");
updateFavoritesCount();

/**
 * Fetches saved favorites from storage and updates the grid.
 * Handles the empty state visually.
 */
function renderFavoritesPage() {
  const favorites = getFavorites();

  if (!favorites.length) {
    favoritesGrid.innerHTML = "";
    renderStatus(statusContainer, "empty", "No favorite books yet. Add some from the Home page.");
    updateFavoritesCount();
    return;
  }

  renderStatus(statusContainer, "");
  renderBookGrid(favoritesGrid, favorites, true); // Render with 'remove-only' flag
  updateFavoritesCount();
}

/**
 * Event Delegation: Efficiently handles removal requests from the favorites grid.
 */
favoritesGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-btn");
  if (!button) return;

  const { bookKey } = button.dataset;

  // Execute removal logic and provide feedback
  const result = removeFavorite(bookKey);
  if (result.wasRemoved) {
    showToast("Book removed from favorites.", "success");
  }
  
  // Refresh the UI to reflect state changes
  renderFavoritesPage();
});

// Initial page render
renderFavoritesPage();
