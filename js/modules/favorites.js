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

// Add a book to favorites only if it is not already saved.
// Returning a structured result makes the calling page easy to read.
export function addFavorite(book) {
  const favorites = getFavorites();
  const alreadyExists = favorites.some((favorite) => favorite.key === book.key);

  // Avoid duplicate favorites.
  // Returning alreadyExists lets the UI show a helpful message instead of silently doing nothing.
  if (alreadyExists) {
    return { updatedFavorites: favorites, wasAdded: false, alreadyExists: true };
  }

  // Use a new array instead of mutating the old one.
  // This pattern is easier to reason about as apps grow and state updates become more complex.
  const updatedFavorites = [...favorites, book];
  saveFavorites(updatedFavorites);
  return { updatedFavorites, wasAdded: true, alreadyExists: false };
}

// Toggle a book in or out of favorites.
// This keeps the Home page simple: the page does not need to know whether
// the action is an add or remove, only that favorites should be toggled.
export function toggleFavorite(book) {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.key === book.key);

  // If the book already exists, remove it and persist the updated array.
  if (exists) {
    return removeFavorite(book.key);
  }

  // If the book is not saved yet, reuse addFavorite so duplicate-prevention
  // and localStorage synchronization stay centralized.
  return addFavorite(book);
}

// Remove one saved book by its key.
// The Favorites page uses this for its remove action, then rerenders from storage.
export function removeFavorite(bookKey) {
  const favorites = getFavorites();
  const updated = favorites.filter((book) => book.key !== bookKey);

  // wasRemoved helps the UI decide whether it should show confirmation feedback.
  const wasRemoved = updated.length !== favorites.length;
  saveFavorites(updated);
  return { updatedFavorites: updated, wasRemoved };
}
