/**
 * Business Logic Module for Favorite Management.
 * Encapsulates operations for checking, adding, and removing favorites.
 */

import { getFavorites, saveFavorites } from "../storage.js";

/**
 * Checks if a specific book is in the favorites list.
 * @param {string} bookKey - Unique identifier for the book.
 * @returns {boolean}
 */
export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some((book) => book.key === bookKey);
}

/**
 * Adds a book to favorites with duplication prevention.
 * @param {Object} book - The book object to add.
 * @returns {Object} Result object containing the new state and status flags.
 */
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

/**
 * Toggles a book's favorite status.
 * @param {Object} book 
 * @returns {Object} Result of the add or remove operation.
 */
export function toggleFavorite(book) {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.key === book.key);

  if (exists) {
    return removeFavorite(book.key);
  }

  return addFavorite(book);
}

/**
 * Removes a book from favorites by its key.
 * @param {string} bookKey 
 * @returns {Object} Result object with removal status.
 */
export function removeFavorite(bookKey) {
  const favorites = getFavorites();
  const updated = favorites.filter((book) => book.key !== bookKey);

  const wasRemoved = updated.length !== favorites.length;
  saveFavorites(updated);
  return { updatedFavorites: updated, wasRemoved };
}
