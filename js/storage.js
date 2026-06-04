// localStorage helpers for favorites and the navbar count.

const FAVORITES_KEY = "bookExplorerFavorites";
const FAVORITES_COUNT_KEY = "bookExplorerFavoritesCount";

export function getFavorites() {
  try {
    const rawData = localStorage.getItem(FAVORITES_KEY);
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error("Could not read favorites from localStorage:", error);
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    localStorage.setItem(FAVORITES_COUNT_KEY, String(favorites.length));
  } catch (error) {
    console.error("Could not save favorites to localStorage:", error);
  }
}

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
    console.error("Could not read favorites count from localStorage:", error);
    return 0;
  }
}

export function saveFavoritesCount(count) {
  try {
    localStorage.setItem(FAVORITES_COUNT_KEY, String(count));
  } catch (error) {
    console.error("Could not save favorites count to localStorage:", error);
  }
}

export function syncFavoritesCount() {
  const count = getFavorites().length;
  saveFavoritesCount(count);
  return count;
}
