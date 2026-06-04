/**
 * Data Persistence Layer.
 * Handles all interactions with localStorage to ensure data consistency across sessions.
 */

const FAVORITES_KEY = "bookExplorerFavorites";
const FAVORITES_COUNT_KEY = "bookExplorerFavoritesCount";

/**
 * Retrieves the collection of favorite books from local storage.
 * @returns {Array<Object>} List of favorite books.
 */
export function getFavorites() {
  try {
    const rawData = localStorage.getItem(FAVORITES_KEY);
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error("[getFavorites] Storage read failure:", error);
    return [];
  }
}

/**
 * Persists the favorites collection and updates the cached count.
 * @arg {Array<Object>} favorites - The updated list of books.
 */
export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    // Redundantly store count for O(1) retrieval during navbar updates
    localStorage.setItem(FAVORITES_COUNT_KEY, String(favorites.length));
  } catch (error) {
    console.error("[saveFavorites] Storage write failure:", error);
  }
}

/**
 * Retrieves the cached favorites count for fast UI updates.
 * Falls back to full array parsing if the cache is missing or invalid.
 * @returns {number}
 */
export function getFavoritesCount() {
  try {
    const rawCount = localStorage.getItem(FAVORITES_COUNT_KEY);

    if (rawCount !== null) {
      const parsedCount = Number(rawCount);
      if (Number.isFinite(parsedCount)) {
        return parsedCount;
      }
    }

    return getFavorites().length;
  } catch (error) {
    console.error("[getFavoritesCount] Storage read failure:", error);
    return 0;
  }
}

/**
 * Updates the cached favorites count.
 * @arg {number} count 
 */
export function saveFavoritesCount(count) {
  try {
    localStorage.setItem(FAVORITES_COUNT_KEY, String(count));
  } catch (error) {
    console.error("[saveFavoritesCount] Storage write failure:", error);
  }
}

/**
 * Forces a synchronization between the favorites array and the cached count.
 * Useful for ensuring UI consistency after manual storage edits or errors.
 * @returns {number} The synchronized count.
 */
export function syncFavoritesCount() {
  const count = getFavorites().length;
  saveFavoritesCount(count);
  return count;
}
