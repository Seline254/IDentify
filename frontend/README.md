# IDentify - Frontend

> Lost document recovery platform for JKUAT students.
> Vanilla JS · Node.js/Express backend · PostgreSQL · Cloudinary

---

## Folder structure

```
frontend/
├── css/
│   ├── main.css          ← design tokens, layout, navbar, hero, all global styles
│   ├── components.css    ← reusable UI: inputs, pills, alerts, cards
│   └── pages.css         ← page-specific: portal sidebar, data tables, dash stats
├── js/
│   ├── api.js            ← ALL fetch() calls to the backend (edit BASE_URL here)
│   ├── auth.js           ← token storage, session helpers
│   ├── faceMatch.js      ← camera, selfie capture, face API call
│   ├── search.js         ← search logic and result card rendering
│   └── upload.js         ← image compression + FormData upload
└── pages/
    ├── index.html        ← landing page (hero + search + how it works)
    ├── search.html       ← full search page with filters
    ├── upload.html       ← finder upload form
    ├── claim.html        ← face verification + claim flow
    └── login.html        ← sign in / register
```

---

## Setup

1. Open `frontend/pages/index.html` in your browser - no build step needed.
2. For live API calls, run the backend first (`cd backend && npm start`).
3. Update `BASE_URL` in `js/api.js` to match your backend port:
   ```js
   const BASE_URL = 'http://localhost:5000/api'; // development
   // const BASE_URL = 'https://your-render-url.onrender.com/api'; // production
   ```

---

## Theme

Light/dark theme is controlled via `data-theme="dark"` on the `<html>` element.
User preference is saved to `localStorage` under key `identify-theme`.

Toggle logic is duplicated per page (no bundler). If you add a new page, paste this at the bottom:

```js
const html = document.documentElement;
const savedTheme = localStorage.getItem('identify-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
const toggle = document.getElementById('themeToggle');
toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('identify-theme', next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
});
```

---

## Wiring the backend (what to replace)

| File | Location | What to wire |
|---|---|---|
| `api.js` | `API.login()` | `POST /auth/login` → returns `{ token, user }` |
| `api.js` | `API.register()` | `POST /auth/register` → returns `{ token, user }` |
| `api.js` | `API.searchByReg()` | `GET /documents/search?reg=...` → returns array of docs |
| `api.js` | `API.getRecent()` | `GET /documents/recent?limit=6` → returns array |
| `api.js` | `API.uploadDocument()` | `POST /documents/upload` multipart → returns `{ docId }` |
| `api.js` | `API.verifyFace()` | `POST /face/verify` multipart → returns `{ match, confidence }` |
| `login.html` | `handleLogin()` | Remove stub, uncomment `API.login()` lines |
| `login.html` | `handleRegister()` | Remove stub, uncomment `API.register()` lines |
| `claim.html` | `runVerification()` | Replace `setTimeout` with `FaceMatch.verify(docId, blob)` |
| `upload.html` | `handleUpload()` | Replace `setTimeout` with `Upload.submit({...})` |
| `search.html` | `runSearch()` | Replace mock data with `Search.run(query, grid, empty, count)` |

---

## Color tokens (JKUAT palette)

```css
--green-800: #0a5c36   /* JKUAT primary green - buttons, accents */
--green-400: #00c896   /* electric teal - highlights, active states */
--gold:      #f5c518   /* gold - secondary accents, warnings */
```

All colors are CSS variables in `main.css`. Change once, updates everywhere.

---

## Browser support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
Camera API (claim.html) requires HTTPS in production - Render provides this automatically.

---

## Team notes

- **Member 1 (backend):** Focus on the API endpoints listed in the wiring table above. Return consistent JSON: `{ success: true, data: {...} }` on success and `{ success: false, message: "..." }` on error.
- **Member 2 (frontend):** The UI is done. Your job is wiring the `api.js` calls into each page and testing edge cases (no file, bad reg number, camera denied).
- **Team lead:** Integration testing between both. Also wire up the officer portal dashboard using `pages.css` `.portal-*` classes - structure is ready.

---

Built with 💚 at JKUAT · July 2026
