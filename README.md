# Stephen Clinton - Power BI Portfolio

A static portfolio site deployed from the `public/` directory.

---

## Adding Screenshots

1. Export your Power BI screenshot as a JPEG or PNG.
2. Drop the file into the `public/screenshots/` folder in this project.
3. Update the relevant `image`, `images` or `<img src="">` reference in the matching HTML file.

```
image: "screenshots/example-report.png"
```

Suggested filenames:
- example-report.png

---

## Running Locally

In a terminal, navigate to this folder and run:

```
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Deploying via GitHub + Netlify

### One-time setup

1. Create a free account at github.com
2. Create a new repository — click + top right, New repository, name it bi-portfolio, leave it Public
3. Upload all files from this folder via Add file > Upload files in GitHub
4. Go to netlify.com, sign in
5. Click Add new site > Import an existing project > GitHub
6. Select your repository
7. Confirm: Build command = npm run build, Publish directory = dist
8. Click Deploy site

Netlify gives you a live public URL immediately.

### Updating after changes

Any file you update in GitHub automatically triggers a new Netlify deployment.

---

## Project structure

  portfolio/
  public/
    index.html
    analytics-engineering.html
    screenshots/   <-- Portfolio screenshot files
    assets/        <-- Shared brand assets
