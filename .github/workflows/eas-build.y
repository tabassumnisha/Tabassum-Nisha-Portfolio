name: Deploy Portfolio to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
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

      - name: Extract portfolio ZIP
        shell: bash
        run: |
          set -e
          mkdir -p site_build
          for z in *.zip; do
            echo "Extracting: $z"
            unzip -o "$z" -d site_build
          done
          echo "--- extracted files ---"
          find site_build -maxdepth 2 -type f | head -30
          test -f site_build/index.html || (echo "index.html missing!" && exit 1)

      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site_build

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
