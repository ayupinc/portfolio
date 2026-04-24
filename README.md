# Stephen Clinton — Power BI Portfolio

A portfolio site built with React + Vite, deployed via GitHub and Netlify.

---

## Adding Screenshots

1. Export your Power BI screenshot as a JPEG (80% quality, ~1920px wide)
2. Drop the file into the `public/images/` folder in this project
3. Open `src/App.jsx` in VS Code
4. Find the dashboard entry — use **Cmd + F** and search for the dashboard title
5. Change `image: null` to `image: "your-filename.jpg"` — for example:

```
image: "csd-wallboard.jpg"
```

Suggested filenames:
- csd-wallboard.jpg
- ems-clinical-flow.jpg
- screening-flow.jpg

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
    images/        <-- Drop screenshot files here
  src/
    App.jsx        <-- All content: text, images, colours
    main.jsx
    index.css
  index.html
  vite.config.js
  package.json
