# Mini Design Canvas (Clean 3D UI)

A full-stack Mini Design Canvas web application built with **Next.js 14**, **React Konva**, **Express**, and **MongoDB**, wrapped in a modern **Clean 3D tactile UI** design system.

---

## Features

### 1. Canvas & Drawing Engine (React Konva)
- **Interactive Shapes & Elements**:
  - Add **Rectangles** with customizable corner radius, fill color, and border stroke.
  - Add **Circles** with interactive radius sizing and styling.
  - Add **Typography/Text** with inline editing, font size, bold, italic, and alignment controls.
- **Konva Transformer**:
  - Drag and move any element across the canvas.
  - Responsive corner/edge scaling and handles.
  - Live rotation handle with degree tracker.
  - Deselect by clicking anywhere on the stage.
- **Visual Grid & Zoom Engine**:
  - Toggle between isometric grid and dot matrix workspace backgrounds.
  - Zoom controls (zoom in, zoom out, reset to 100%).

### 2. Layers & Properties Management
- **Properties Inspector**:
  - Precise $X$ and $Y$ coordinates, width, height, and radius controls.
  - Rotation angle slider and inputs.
  - 12 curated 3D palette swatches + native hex/color picker.
  - Opacity slider (0% to 100%).
  - Stroke width and stroke color configuration.
  - Canvas background styling.
- **Layers Hierarchy**:
  - Visual layers list with icons and layer labels.
  - Bring to Front, Send to Back, Move Layer Up, Move Layer Down.
  - Lock / Unlock element toggle (prevents accidental movement).
  - Visibility toggle (hide/show layer).
  - Quick delete layer.

### 3. Undo / Redo & Shortcuts
- Robust snapshot history stack (up to 50 operations).
- **Keyboard Shortcuts**:
  - `Ctrl + Z`: Undo
  - `Ctrl + Y` or `Ctrl + Shift + Z`: Redo
  - `Ctrl + D`: Duplicate selected element
  - `Ctrl + S`: Save canvas modal
  - `Delete` / `Backspace`: Delete selected element
  - `R`: Add rectangle
  - `O`: Add circle
  - `T`: Add text
  - `V`: Select tool

### 4. Persistence & Cloud Storage (MongoDB + Express)
- Save canvas directly to MongoDB database with element count and timestamp.
- Browse saved canvases modal: view, open, and delete saved projects.
- Real-time cloud status indicator ("Saved", "Unsaved", "Saving...").
- Export high-resolution PNG image directly to your computer.
- Export canvas data as JSON.

### 5. Authentication & Access Control (JWT + Bcrypt)
- **User Authentication**: Secure Sign In and Registration powered by JSON Web Tokens (JWT) and Bcrypt password hashing.
- **Canvas Ownership & Privacy**:
  - Save designs privately to your personal user account.
  - Optional Public toggle: share read access with anyone.
  - Filter canvases in modal: "All Canvases", "My Canvases", or "Public Canvases".
  - Full access control: only authors can edit or delete their own canvases.
- **Persistent Sessions**: Automatic token hydration via `localStorage` and verification against `/api/auth/me`.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` (or remote URI in `backend/.env`)

### Install Dependencies
```bash
npm run install:all
```

### Run Locally (Concurrently)
```bash
npm run dev
```
- Frontend runs at: `http://localhost:3000`
- Backend API runs at: `http://localhost:5000`
