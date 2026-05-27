// ========================================
// Favorites State Module
// Responsible for favorite-book rules:
// - checking whether a book is already saved
// - adding a new favorite
// - removing an existing favorite
// - delegating persistence to storage.js
// ========================================

import { getFavorites, saveFavorites } from "../storage.js";

// Check if a book is already in the saved favorites list.
// The UI uses this to decide whether a card button should say
// "Add Favorite" or "Remove Favorite".
export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some((book) => book.key === bookKey);
}

// Toggle a book in or out of favorites.
// This keeps the Home page simple: the page does not need to know whether
// the action is an add or remove, only that favorites should be toggled.
export function toggleFavorite(book) {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.key === book.key);

  // If the book already exists, remove it and persist the updated array.
  if (exists) {
    const updated = favorites.filter((fav) => fav.key !== book.key);
    saveFavorites(updated);
    return { updatedFavorites: updated, wasAdded: false };
  }

  // If the book is new, append it and persist the updated array.
  const updated = [...favorites, book];
  saveFavorites(updated);
  return { updatedFavorites: updated, wasAdded: true };
}

// Remove one saved book by its key.
// The Favorites page uses this for its remove action, then rerenders from storage.
export function removeFavorite(bookKey) {
  const favorites = getFavorites();
  const updated = favorites.filter((book) => book.key !== bookKey);
  saveFavorites(updated);
  return updated;
}
