// Favorite-book state helpers.

import { getFavorites, saveFavorites } from "../storage.js";

export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some((book) => book.key === bookKey);
}

export function addFavorite(book) {
  const favorites = getFavorites();
  const alreadyExists = favorites.some((favorite) => favorite.key === book.key);

  if (alreadyExists) {
    return { updatedFavorites: favorites, wasAdded: false, alreadyExists: true };
  }

  const updatedFavorites = [...favorites, book];
  saveFavorites(updatedFavorites);
  return { updatedFavorites, wasAdded: true, alreadyExists: false };
}

export function toggleFavorite(book) {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.key === book.key);

  if (exists) {
    return removeFavorite(book.key);
  }

  return addFavorite(book);
}

export function removeFavorite(bookKey) {
  const favorites = getFavorites();
  const updated = favorites.filter((book) => book.key !== bookKey);

  const wasRemoved = updated.length !== favorites.length;
  saveFavorites(updated);
  return { updatedFavorites: updated, wasRemoved };
}
