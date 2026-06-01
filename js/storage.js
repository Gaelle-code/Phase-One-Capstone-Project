// ========================================
// localStorage Module
// Responsible for reading and writing favorite books.
// This file is the only place that directly talks to localStorage, which keeps
// browser storage details separate from UI rendering and page behavior.
// ========================================

// Storage keys are constants so every module reads/writes the same names.
// This avoids subtle bugs caused by mistyped localStorage strings.
const FAVORITES_KEY = "bookExplorerFavorites";
const FAVORITES_COUNT_KEY = "bookExplorerFavoritesCount";

// Read favorites from localStorage and return a normal JavaScript array.
// If storage is empty or unreadable, returning [] lets the rest of the app
// keep working with a predictable data type.
export function getFavorites() {
  try {
    const rawData = localStorage.getItem(FAVORITES_KEY);
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error("Could not read favorites from localStorage:", error);
    return [];
  }
}

// Save the latest favorites array into localStorage.
// This synchronization step is what makes user selections persist after refresh
// or after navigating between Home and Favorites pages.
export function saveFavorites(favorites) {
  try {
    // Store the full book objects for the Favorites page.
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    // Store the count beside the array so the navbar badge has a quick value.
    localStorage.setItem(FAVORITES_COUNT_KEY, String(favorites.length));
  } catch (error) {
    console.error("Could not save favorites to localStorage:", error);
  }
}

// Read the saved favorites count.
// The count is stored separately so the navbar can update instantly without
// recalculating it every time the page draws the header.
export function getFavoritesCount() {
  try {
    const rawCount = localStorage.getItem(FAVORITES_COUNT_KEY);

    // Prefer the saved count when it is valid because it is simple and fast to read.
    if (rawCount !== null) {
      const parsedCount = Number(rawCount);
      if (Number.isFinite(parsedCount)) {
        return parsedCount;
      }
    }

    // Fallback: if the count is missing or damaged, calculate it from saved books.
    return getFavorites().length;
  } catch (error) {
    console.error("Could not read favorites count from localStorage:", error);
    return 0;
  }
}

// Keep the count key in sync with the favorites array.
// This gives us a quick, persistent source of truth for the navbar badge.
export function saveFavoritesCount(count) {
  try {
    localStorage.setItem(FAVORITES_COUNT_KEY, String(count));
  } catch (error) {
    console.error("Could not save favorites count to localStorage:", error);
  }
}

// Recalculate the count from the saved favorites array and persist it.
// This is useful when the app needs to repair stale storage values.
export function syncFavoritesCount() {
  const count = getFavorites().length;
  saveFavoritesCount(count);
  return count;
}
