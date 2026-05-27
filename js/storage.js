// ========================================
// localStorage Module
// Responsible for reading and writing favorite books.
// This file is the only place that directly talks to localStorage, which keeps
// browser storage details separate from UI rendering and page behavior.
// ========================================

const FAVORITES_KEY = "bookExplorerFavorites";

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
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Could not save favorites to localStorage:", error);
  }
}
