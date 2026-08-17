# CineTrack — Movie & TV Show Watchlist (Django REST + React)

A full-stack movie and TV show watchlist application built with **Django REST Framework (DRF)** on the backend and **React (Vite)** on the frontend.

---

## ⚡ How to Run in VS Code (3 Simple Ways)

### Option 1: 1-Click VS Code Shortcut (Recommended)
1. Open this folder in **VS Code**.
2. Press **`Ctrl` + `Shift` + `B`** (or go to top menu: **Terminal** > **Run Build Task**).
3. VS Code will automatically start **both** the Django backend and React frontend concurrently!

---

### Option 2: 1-Click Batch File
- In VS Code file explorer (or Windows Explorer), simply double-click **`run_project.bat`**.
- It will automatically launch the backend server, frontend server, and open `http://localhost:5173/` in your browser.

---

### Option 3: Manual Terminal in VS Code

**Terminal 1 — Backend (Django)**:
```powershell
cd backend
..\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

**Terminal 2 — Frontend (React)**:
```powershell
cd frontend
npm.cmd run dev
```

---

## 🔑 Demo Account
- **Username**: `demo`
- **Password**: `password123`
*(Or click **Create an account** to register a new user)*

---

## 🌟 Key Features
1. **Universal Poster Search Engine**: Real-time search across IMDb (Cinemeta), Apple iTunes, and TVMaze for high-resolution movie and TV show artwork.
2. **Ambient Background Animations**: Smooth floating glowing orbs with Dark Mode & Light Mode support.
3. **Private Watchlists**: Strict user isolation via SimpleJWT authentication.
4. **Interactive 5-Star Ratings & Tabs**: To Watch queue, Watched collection, real-time score updates, sorting, and statistics.
