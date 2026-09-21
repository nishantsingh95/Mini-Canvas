'use client';

import React from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Download,
  Plus,
  FileJson,
} from 'lucide-react';

export default function Navbar({
  canvasName,
  onNameChange,
  saveStatus, // 'saved', 'unsaved', 'saving'
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onNewCanvas,
  onOpenModal,
  onSave,
  onExportPNG,
  onExportJSON,
}) {
  return (
    <header className="navbar">
      {/* Brand & Document Name */}
      <div className="navbar-left">
        <div className="brand-badge">
          <Sparkles size={16} />
          <span>MINI CANVAS</span>
        </div>

        <input
          type="text"
          className="canvas-title-input"
          value={canvasName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Untitled Canvas"
          title="Click to rename canvas"
        />

        <div className="status-pill">
          <div className={`status-dot ${saveStatus}`} />
          <span>
            {saveStatus === 'saved' && 'Saved'}
            {saveStatus === 'unsaved' && 'Unsaved'}
            {saveStatus === 'saving' && 'Saving...'}
          </span>
        </div>
      </div>

      {/* History & Primary Quick Actions */}
      <div className="navbar-center">
        <button
          className="btn-3d btn-3d-icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          className="btn-3d btn-3d-icon"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>

        <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />

        <button
          className="btn-3d btn-3d-secondary"
          onClick={onNewCanvas}
          title="Create brand new canvas"
        >
          <Plus size={15} />
          <span>New</span>
        </button>

        <button
          className="btn-3d btn-3d-secondary"
          onClick={onOpenModal}
          title="Open saved canvas from cloud"
        >
          <FolderOpen size={15} />
          <span>Open</span>
        </button>
      </div>

      {/* Save & Export Actions */}
      <div className="navbar-right">
        <button
          className="btn-3d btn-3d-secondary"
          onClick={onExportJSON}
          title="Export Canvas as JSON file"
        >
          <FileJson size={15} />
          <span>JSON</span>
        </button>

        <button
          className="btn-3d btn-3d-secondary"
          onClick={onExportPNG}
          title="Download High-Res PNG Image"
        >
          <Download size={15} />
          <span>Export PNG</span>
        </button>

        <button
          className="btn-3d btn-3d-primary"
          onClick={onSave}
          title="Save Canvas to Database"
        >
          <Save size={15} />
          <span>Save Canvas</span>
        </button>
      </div>
    </header>
  );
}
