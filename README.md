# Mini Design Canvas (Clean 3D Studio)

A full-stack Mini Design Canvas application built with **Next.js 14**, **React Konva**, **Node.js**, **Express**, and **MongoDB**, wrapped in a modern **Clean 3D tactile UI** design system.

---

## Table of Contents
- [Assignment Overview & Requirements Checklist](#assignment-overview--requirements-checklist)
- [Bonus Features Implemented](#bonus-features-implemented)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [API Endpoints](#api-endpoints)
- [Getting Started & Setup](#getting-started--setup)
- [Environment Variables](#environment-variables)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Known Limitations](#known-limitations)

---

## Assignment Overview & Requirements Checklist

### Core Requirements
- [x] **Create a new canvas**: Blank canvas initialization with clean state and confirmation prompt.
- [x] **Shape & Text Tools**: Add Rectangle, Circle, and Typography elements.
- [x] **Transformer Integration**: Select, drag, resize, and rotate elements with React Konva's Transformer.
- [x] **Properties Inspector**: Real-time inspection and editing of $X$, $Y$, width, height, radius, rotation, fill color, text styling, opacity, and stroke width.
- [x] **Delete Elements**: Delete via UI button, Layer item button, or `Delete` / `Backspace` hotkeys.
- [x] **Save to MongoDB**: Persist full canvas state including dimensions, colors, elements hierarchy, metadata, and owner.
- [x] **Load, Update, and Delete**: Browse cloud canvases in modal, open saved designs, update changes, and delete projects.

### Frontend Expectations
- [x] **Next.js 14 (App Router) + React 18**.
- [x] **React Konva / Konva**: Uses dynamic `Stage` and `Layer` with client-only dynamic loading to avoid SSR canvas mismatches.
- [x] **Full Editor Shell**: Floating 3D Toolbar, Central Viewport with Dot/Isometric grid, Dual-tab Sidebar (Properties & Layers), and Status Navbar.
- [x] **State Synchronization**: React state maintains element attributes and is updated seamlessly on drag and transform end events.

### Backend Expectations
- [x] **Node.js + Express REST API**.
- [x] **MongoDB Persistence**: Mongoose schemas for `Canvas` and `User`.
- [x] **Production Standards**: Modular routing, controllers, error handling middleware, CORS configuration, and environment variable loading.

---

## Bonus Features Implemented

All 5 assignment bonus features have been implemented:

1. **Layer Management & Reordering**:
   - Visual layers hierarchy list with drag-free reordering controls.
   - **Bring to Front**, **Send to Back**, **Move Up**, and **Move Down**.
   - Lock layer toggle (prevents accidental selection or movement).
   - Visibility toggle (hide/show layers on stage).
   - Instant layer deletion.

2. **Undo / Redo Engine**:
   - Snapshot-based history stack using a custom React hook (`useCanvasHistory`).
   - Supports up to 50 operations with `Ctrl+Z` (Undo) and `Ctrl+Y` / `Ctrl+Shift+Z` (Redo).
   - Reactive buttons in the Navbar that enable/disable based on history stack state.

3. **Autosave to Cloud**:
   - Debounced automatic background sync (2 seconds after user stops editing).
   - Non-blocking cloud updates with live Navbar status pill (`Autosaved`, `Unsaved`, `Autosaving...`).
   - Toggle switch in the Properties panel under "Canvas Settings" to enable or disable autosave on demand.

4. **Authentication with User-Owned Canvases**:
   - Secure Sign In & Registration with JSON Web Tokens (JWT) and `bcryptjs` password hashing.
   - Private vs. Public canvas visibility controls.
   - Canvas ownership isolation: users only modify/delete their own canvases.
   - Filter canvases by **All**, **My Canvases**, or **Public Canvases**.
   - Persistent session storage in `localStorage` with `/api/auth/me` token hydration.

5. **PNG & JSON Export**:
   - Export high-resolution PNG image directly at 2x pixel ratio (`pixelRatio: 2`) via Stage data URL.
   - Export canvas structure as structured JSON file for local backup.

---

## Architecture & Design Decisions

### 1. Clean 3D UI Design System
Instead of generic flat styling or unstyled components, the application is built with a custom Clean 3D tactile aesthetic:
- **Depth & Dimension**: Subtle bevel shadows (`box-shadow: 0 4px 0 #cbd5e1`), smooth active button press physics, and glassmorphic panels.
- **Typography & Theme**: Google Fonts (*Plus Jakarta Sans* for UI, *JetBrains Mono* for coordinates and hex colors).
- **Workspace Flexibility**: Toggleable isometric grid and dot matrix background with dynamic zoom scaling (25% to 250%).

### 2. Next.js SSR & Konva Integration
HTML5 Canvas relies on `window` and `document` APIs that do not exist during Next.js server-side rendering:
- `StageCanvas.jsx` is dynamically imported in `CanvasContainer.jsx` with `ssr: false` to ensure zero hydration mismatch.
- Transformers and Konva shape nodes are managed declaratively using `ref` attachments on shape selection.

### 3. State Management & Snapshot History
- Canvas elements are stored in standard immutable React arrays.
- On transform and drag ends, attributes (`x`, `y`, `width`, `height`, `rotation`) are normalized and committed to the history stack.
- Text shapes support direct inline modal editing as well as real-time property inspector controls.

### 4. Backend Authentication & Authorization
- Dual middleware strategy:
  - `protect`: Strict guard for authenticated routes (e.g. `/api/auth/me`).
  - `optionalAuth`: Applied to `/api/canvases` so guest users can browse public/unowned designs while authenticated users automatically claim ownership and access their private canvases.
- Password hashes are protected with `select: false` on the User model.

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with `email` and `password`, returns JWT token |
| `GET` | `/api/auth/me` | Private | Fetch currently authenticated user's profile |

### Canvases (`/api/canvases`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/canvases` | Public / Auth | List canvases (owned by user + public canvases) |
| `POST` | `/api/canvases` | Public / Auth | Create a new canvas project |
| `GET` | `/api/canvases/:id` | Public / Auth | Get canvas by ID (verifies ownership or public access) |
| `PUT` | `/api/canvases/:id` | Public / Auth | Update canvas (restricted to canvas owner) |
| `DELETE`| `/api/canvases/:id` | Public / Auth | Delete canvas (restricted to canvas owner) |

### Health Check
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns API status and MongoDB connection state |

---

## Getting Started & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (local community server running at `mongodb://localhost:27017` or a remote MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/nishantsingh95/Mini-Canvas.git
cd Mini-Canvas
```

### 2. Install Dependencies
Install dependencies for root, backend, and frontend with a single command:
```bash
npm run install:all
```

Or install individually:
```bash
# In backend directory
cd backend && npm install

# In frontend directory
cd ../frontend && npm install
```

### 3. Configure Environment Variables
Copy `.env.example` into `.env` for both backend and frontend:
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env.local
```

### 4. Run Locally
Run both backend API and frontend Next.js dev servers concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/api/health`

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini_design_canvas?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=super_secret_mini_canvas_jwt_key_2026
JWT_EXPIRES_IN=7d
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` or `Ctrl + Shift + Z` | Redo action |
| `Ctrl + D` | Duplicate selected element |
| `Ctrl + S` | Open Cloud Save Modal |
| `Delete` / `Backspace` | Delete selected element |
| `R` | Add Rectangle |
| `O` | Add Circle |
| `T` | Add Text element |
| `V` | Switch to Select Tool |

---

## Known Limitations
- **Freehand Drawing**: Path and pencil bezier curves are not yet included in the initial shape set.
- **Collaborative Real-time Sockets**: Currently uses REST autosync and polling rather than WebSockets (Socket.io).
- **Complex Multi-Select**: Single element selection is prioritized; group bounding boxes for multi-selection can be extended in future releases.
