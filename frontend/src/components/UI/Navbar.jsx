'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Download,
  Plus,
  FileJson,
  User,
  LogOut,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  autoSaveEnabled = true,
}) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
            {saveStatus === 'saved' && (autoSaveEnabled ? 'Autosaved' : 'Saved')}
            {saveStatus === 'unsaved' && 'Unsaved'}
            {saveStatus === 'saving' && (autoSaveEnabled ? 'Autosaving...' : 'Saving...')}
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

        <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 2px' }} />

        {/* Authentication Status / Profile */}
        {isAuthenticated ? (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className="user-profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title={`Logged in as ${user?.name}`}
            >
              <div className="user-avatar-badge">{getInitials(user?.name)}</div>
              <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-header">
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {user?.email}
                  </div>
                </div>

                <div style={{ padding: '6px' }}>
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenModal();
                    }}
                  >
                    <Layers size={14} />
                    <span>My Cloud Canvases</span>
                  </button>

                  <button
                    className="user-dropdown-item logout"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn-3d btn-3d-secondary"
            onClick={() => openAuthModal('login')}
            title="Sign in or create account to save canvases privately"
          >
            <User size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
