// Shared UI helpers used by multiple pages.

import { isFavorite } from "./modules/favorites.js";
import { syncFavoritesCount } from "./storage.js";

const COVER_BASE_URL = "https://covers.openlibrary.org/b/id";

const TOAST_DURATION_MS = 3500;

function getToastContainer() {
  let toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className =
      "pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3 px-0 sm:right-6 sm:top-6";
    toastContainer.setAttribute("aria-label", "Notifications");
    toastContainer.setAttribute("aria-live", "polite");
    toastContainer.setAttribute("aria-atomic", "true");
    document.body.appendChild(toastContainer);
  }

  return toastContainer;
}

export function showToast(message, type = "info") {
  if (!message) return;

  const toastContainer = getToastContainer();
  const toast = document.createElement("div");
  const styleMap = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    info: "border-slate-200 bg-white text-slate-700",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

  toast.className = `pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ease-out opacity-0 translate-x-2 ${styleMap[type] || styleMap.info}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.innerHTML = `
    <div class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${type === "success" ? "bg-emerald-500" : type === "error" ? "bg-rose-500" : "bg-slate-500"}"></div>
    <p class="text-sm font-medium leading-6">${message}</p>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-x-2");
    toast.classList.add("opacity-100", "translate-x-0");
  });

  const hideToast = () => {
    toast.classList.add("opacity-0", "translate-x-2");
    toast.classList.remove("opacity-100", "translate-x-0");
    window.setTimeout(() => toast.remove(), 300);
  };

  window.setTimeout(hideToast, TOAST_DURATION_MS);
}

export function updateFavoritesCount() {
  const count = syncFavoritesCount();

  document.querySelectorAll("[data-favorites-count]").forEach((element) => {
    element.textContent = String(count);
  });

  document.querySelectorAll('[data-nav-link="favorites"]').forEach((link) => {
    link.setAttribute("aria-label", `Favorites (${count})`);
  });

  return count;
}

export function setupNavbar(activePage) {
  const toggleButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      toggleButton.setAttribute("aria-expanded", String(isHidden));
    });
  }

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.getAttribute("data-nav-link") === activePage) {
      link.classList.add("active-nav");
    }
  });

  updateFavoritesCount();
}

// Render loading, empty, error, or info messages.
export function renderStatus(container, type, message) {
  if (!container) return;

  if (type === "loading") {
    container.innerHTML = `
      <div class="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-600">
        <div class="spinner" aria-hidden="true"></div>
        <p>Loading books...</p>
      </div>
    `;
    return;
  }

  if (!message) {
    container.innerHTML = "";
    return;
  }

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

function getCoverUrl(coverId) {
  return coverId ? `${COVER_BASE_URL}/${coverId}-M.jpg` : "https://placehold.co/300x450/e2e8f0/475569?text=No+Cover";
}

// Create reusable HTML for one book card.
export function createBookCard(book, showRemoveOnly = false) {
  const favorite = isFavorite(book.key);

  const buttonText = showRemoveOnly ? "Remove Favorite" : favorite ? "Remove Favorite" : "Add Favorite";
  const buttonClass = favorite || showRemoveOnly ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700";
  const favoriteAction = showRemoveOnly || favorite ? "remove" : "add";

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
          data-favorite-action="${favoriteAction}"
          aria-label="${buttonText} ${book.title}"
        >
          ${buttonText}
        </button>
      </div>
    </article>
  `;
}

export function renderBookGrid(container, books, showRemoveOnly = false) {
  if (!container) return;
  container.innerHTML = books.map((book) => createBookCard(book, showRemoveOnly)).join("");
}

if (window.location.pathname.endsWith("about.html")) {
  setupNavbar("about");
}
