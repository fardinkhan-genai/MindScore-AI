# Mental Health Predictor — Frontend

A small React (Vite) app that calls your existing FastAPI `/predict` endpoint from `main.py`.

## Run it

1. Start your backend first (from your project folder with `main.py`):
   ```
   uvicorn main:app --reload
   ```
   It should be listening on `http://127.0.0.1:8000`. Your `main.py` already has
   `CORSMiddleware` set to allow all origins, so no backend changes are needed.

2. In this frontend folder:
   ```
   npm install
   npm run dev
   ```
   Then open the URL Vite prints (usually `http://localhost:5173`).

## If your API runs somewhere else

Open `src/App.jsx` and change the address defined near the top of the file to match where your server is running.

## What's here

- `src/App.jsx` — the form (matches every field in your `StudentData` Pydantic model) and the result view
- `src/App.css` — all the styling
- `index.html` / `src/main.jsx` — standard Vite entry points
