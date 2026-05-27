// ========================================
// Shared UI Module
// Responsible for reusable interface behavior:
// - mobile navigation setup
// - active navigation styling
// - loading, empty, error, and info messages
// - reusable book card markup
// - responsive grid rendering helpers
// ========================================

import { isFavorite } from "./modules/favorites.js";

const COVER_BASE_URL = "https://covers.openlibrary.org/b/id";

// Set up navigation behavior used across all pages.
// The activePage argument lets each page tell this helper which nav item
// should be visually highlighted.
export function setupNavbar(activePage) {
  const toggleButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  // Mobile menu interaction:
  // Clicking the button opens/closes the menu and updates aria-expanded
  // so assistive technology receives the current menu state.
  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      toggleButton.setAttribute("aria-expanded", String(isHidden));
    });
  }

  // Active-link styling is based on data attributes instead of page URLs.
  // This keeps the logic readable and avoids brittle pathname checks.
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.getAttribute("data-nav-link") === activePage) {
      link.classList.add("active-nav");
    }
  });
}

// Render feedback messages in one shared place.
// Pages call this helper for loading, empty, error, and informational states
// so the app uses consistent spacing, color, and accessibility behavior.
export function renderStatus(container, type, message) {
  if (!container) return;

  // Loading state appears while the API request is in progress.
  // Keeping this visual state separate from the book grid avoids layout confusion.
  if (type === "loading") {
    container.innerHTML = `
      <div class="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-600">
        <div class="spinner" aria-hidden="true"></div>
        <p>Loading books...</p>
      </div>
    `;
    return;
  }

  // A blank message clears the status area after successful rendering.
  if (!message) {
    container.innerHTML = "";
    return;
  }

  // Centralized styles make feedback states easy to adjust later.
  const styleMap = {
    empty: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-slate-200 bg-white text-slate-600",
  };

  container.innerHTML = `
    <div class="rounded-md border px-4 py-3 ${styleMap[type] || styleMap.info}">
      <p>${message}</p>
    </div>
  `;
}

// Build the correct image URL for a book cover.
// Some API results do not include coverId, so a generated placeholder keeps
// every card visually complete and prevents broken image icons.
function getCoverUrl(coverId) {
  return coverId ? `${COVER_BASE_URL}/${coverId}-M.jpg` : "https://placehold.co/300x450/e2e8f0/475569?text=No+Cover";
}

// Create reusable HTML for a single book card.
// This keeps card structure in one module so Home and Favorites pages render
// consistent book UI without duplicating markup.
export function createBookCard(book, showRemoveOnly = false) {
  // The button state depends on localStorage, so cards always reflect the
  // latest favorite state even after refresh or navigation.
  const favorite = isFavorite(book.key);
  const buttonText = showRemoveOnly ? "Remove Favorite" : favorite ? "Remove Favorite" : "Add Favorite";
  const buttonClass = favorite || showRemoveOnly ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700";

  return `
    <article class="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src="${getCoverUrl(book.coverId)}"
        alt="Cover of ${book.title}"
        class="h-64 w-full object-cover"
        loading="lazy"
      />
      <div class="flex flex-1 flex-col p-4">
        <h3 class="min-h-14 text-lg font-semibold text-slate-800">${book.title}</h3>
        <p class="mt-2 text-sm text-slate-600"><span class="font-medium">Author:</span> ${book.author}</p>
        <p class="mt-1 text-sm text-slate-600"><span class="font-medium">Published:</span> ${book.publishYear}</p>
        <button
          class="favorite-btn mt-4 rounded-md px-4 py-2 text-sm font-semibold text-white transition ${buttonClass}"
          data-book-key="${book.key}"
          aria-label="${buttonText} ${book.title}"
        >
          ${buttonText}
        </button>
      </div>
    </article>
  `;
}

// Render a full list of books into a grid container.
// The responsive column behavior is defined in the HTML with Tailwind classes,
// while this helper focuses only on generating the card markup.
export function renderBookGrid(container, books, showRemoveOnly = false) {
  if (!container) return;
  container.innerHTML = books.map((book) => createBookCard(book, showRemoveOnly)).join("");
}

// Run navbar setup automatically for simple pages like About.
// Home and Favorites call setupNavbar from their page-specific entry files
// because they also initialize more interactive behavior.
if (window.location.pathname.endsWith("about.html")) {
  setupNavbar("about");
}
