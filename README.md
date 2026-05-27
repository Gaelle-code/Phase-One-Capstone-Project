# Gaelle Book Store

Gaelle Book Store is a responsive multi-page frontend web app built with:

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES6 Modules)
- Open Library API
- localStorage

Users can search books by title, browse results, add/remove favorites, and keep favorites after refresh.

## Project Structure

```text
book-explorer/
│
├── index.html
├── favorites.html
├── about.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── favoritesPage.js
│   ├── ui.js
│   ├── storage.js
│   ├── api/
│   │   └── fetchBooks.js
│   └── modules/
│       └── favorites.js
│
├── assets/
└── README.md
```

## Features

- Responsive navbar, hero section, and grid layout
- Search books from Open Library API
- Loading state, no-results state, and error state
- Favorite/unfavorite books
- Favorites persisted with localStorage
- Dedicated favorites page
- About page explaining the app purpose

## API Used

- Search endpoint: `https://openlibrary.org/search.json?q=`
- Cover images: `https://covers.openlibrary.org/b/id/{coverId}-M.jpg`

## Run Locally

Because this app uses ES modules, run it with a local server (instead of opening files directly):

1. Open this folder in your terminal.
2. Start a simple server (example with VS Code Live Server or any static server).
3. Open `index.html` through that local server.

## Beginner Notes

- `main.js` controls the Home page behavior.
- `favoritesPage.js` controls the Favorites page.
- `fetchBooks.js` handles API communication.
- `storage.js` and `modules/favorites.js` handle favorite data logic.
- `ui.js` contains reusable UI rendering and navbar setup.

## GitHub Collaboration Simulation

This section explains a simple team workflow:

1. **Feature Branches**
   - Create one branch per feature.
   - Example: `feature/search-books`, `feature/favorites-page`.
   - Keeps `main` stable and easy to review.

2. **Pull Requests (PRs)**
   - Open a PR when a feature branch is ready.
   - Add a short summary, screenshots, and test notes.
   - Ask teammates for review before merging.

3. **Issues**
   - Track bugs, improvements, and tasks with GitHub Issues.
   - Label issues (bug, enhancement, documentation).
   - Link PRs to related issues (for traceability).

4. **Project Workflow**
   - Use GitHub Projects board with columns like:
     - `Todo`
     - `In Progress`
     - `Review`
     - `Done`
   - Move issues/PRs across columns to visualize progress.

## Accessibility and UX Details

- Semantic HTML sections and headings
- Accessible button labels (`aria-label`)
- Mobile-first responsive design
- Clear visual feedback for loading, errors, and empty states

## License

This project is for educational use.
