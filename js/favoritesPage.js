// Favorites page entry: render saved books and remove favorites.

import { getFavorites } from "./storage.js";
import { removeFavorite } from "./modules/favorites.js";
import { renderBookGrid, renderStatus, setupNavbar, showToast, updateFavoritesCount } from "./ui.js";

const favoritesGrid = document.getElementById("favorites-grid");
const statusContainer = document.getElementById("status-container");

setupNavbar("favorites");
updateFavoritesCount();

function renderFavoritesPage() {
  const favorites = getFavorites();

  if (!favorites.length) {
    favoritesGrid.innerHTML = "";
    renderStatus(statusContainer, "empty", "No favorite books yet. Add some from the Home page.");
    updateFavoritesCount();
    return;
  }

  renderStatus(statusContainer, "");
  renderBookGrid(favoritesGrid, favorites, true);
  updateFavoritesCount();
}

// Event delegation handles remove buttons for all rendered favorite cards.
favoritesGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-btn");
  if (!button) return;

  const { bookKey } = button.dataset;

  const result = removeFavorite(bookKey);
  if (result.wasRemoved) {
    showToast("Book removed from favorites.", "success");
  }
  renderFavoritesPage();
});

renderFavoritesPage();
