#!/usr/bin/env bash
set -euo pipefail

# Git helper script: create branch, commit per-file with descriptive messages, and push.
# Run from the repository root: `bash git-commit-and-push.sh`

BRANCH="feature/search-and-favorites"

# file|commit-message pairs
FILES_AND_MESSAGES=(
  "js/storage.js|feat(storage): Add robust localStorage persistence and cached favorites count"
  "js/modules/favorites.js|feat(favorites): Implement add/remove/toggle favorites with duplication prevention and consistent return results"
  "js/ui.js|feat(ui): Render book cards, toasts, navbar setup, and favorites-count sync"
  "js/api/fetchBooks.js|feat(api): Fetch and normalize Open Library results with error handling and result limiting"
  "js/main.js|feat(search): Implement search flow, initial load, and event-delegated favorite toggling on Home page"
  "js/favoritesPage.js|feat(favorites-page): Render favorites page, remove flow, and empty-state handling"
  "index.html|feat(html): Add data placeholders and grid containers for dynamic rendering; wire JS modules"
  "favorites.html|feat(html): Add data placeholders and grid containers for dynamic rendering; wire JS modules"
  "README.md|docs(readme): Update README with project structure and run instructions"
)

# Ensure we're inside a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not a git repository. Run this script from the repo root."
  exit 1
fi

# Checkout existing branch or create a new one
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  echo "Checking out existing branch: $BRANCH"
  git checkout "$BRANCH"
else
  echo "Creating and checking out branch: $BRANCH"
  git checkout -b "$BRANCH"
fi

# Commit each file with its message if there are changes
any_committed=false
for pair in "${FILES_AND_MESSAGES[@]}"; do
  file="${pair%%|*}"
  msg="${pair#*|}"

  if [ ! -e "$file" ]; then
    echo "Skipping (not found): $file"
    continue
  fi

  if git status --porcelain -- "$file" | grep -q .; then
    echo "Staging and committing: $file"
    git add -- "$file"
    if git commit -m "$msg" -- "$file"; then
      any_committed=true
    else
      echo "Warning: commit returned non-zero for $file (it may have no staged changes)."
    fi
  else
    echo "No changes to commit for: $file"
  fi
done

if [ "$any_committed" = false ]; then
  echo "No files were committed. Nothing to push."
  exit 0
fi

# Push the branch upstream
echo "Pushing branch $BRANCH to origin..."
git push -u origin "$BRANCH"

echo "Done. Branch '$BRANCH' pushed to origin."
