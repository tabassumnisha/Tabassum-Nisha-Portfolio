name: Deploy Portfolio to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Extract ZIP into repo
        shell: bash
        run: |
          set -e
          HAVE_ZIP=false
          for z in *.zip; do
            if [ -f "$z" ]; then
              HAVE_ZIP=true
              echo "Extracting $z"
              unzip -o "$z" -d /tmp/zx
            fi
          done
          if [ "$HAVE_ZIP" = true ]; then
            cp -rf /tmp/zx/. .
            echo "Files placed:"
            ls index.html styles.css script.js
          else
            echo "No ZIP found, using existing files"
          fi

      - name: Commit extracted files
        shell: bash
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "bot@users.noreply.github.com"
          git add -A
          if git diff --staged --quiet; then
            echo "Nothing new to commit"
          else
            git commit -m "Auto extract ZIP [skip ci]"
            git push
            echo "Committed to repo"
          fi

      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
