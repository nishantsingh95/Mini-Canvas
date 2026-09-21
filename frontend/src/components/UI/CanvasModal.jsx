'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  FolderOpen,
  Save,
  Trash2,
  Calendar,
  Layers,
  Loader2,
  Globe,
  Lock,
  User,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function CanvasModal({
  isOpen,
  mode, // 'save' | 'open'
  onClose,
  canvasName,
  initialIsPublic = false,
  onSaveSubmit,
  onLoadCanvas,
  elementsCount,
  onNotify,
}) {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [nameInput, setNameInput] = useState(canvasName);
  const [isPublicInput, setIsPublicInput] = useState(initialIsPublic);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'mine' | 'public'
  const [savedCanvases, setSavedCanvases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setNameInput(canvasName);
    setIsPublicInput(initialIsPublic);
  }, [canvasName, initialIsPublic, isOpen]);

  useEffect(() => {
    if (isOpen && mode === 'open') {
      fetchCanvases();
    }
  }, [isOpen, mode]);

  const fetchCanvases = async () => {
    setLoading(true);
    try {
      const list = await api.getCanvases();
      setSavedCanvases(list);
    } catch (err) {
      console.error(err);
      if (onNotify) onNotify('Failed to load saved canvases from cloud', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved canvas?')) return;
    setDeletingId(id);
    try {
      await api.deleteCanvas(id);
      setSavedCanvases((prev) => prev.filter((c) => c._id !== id && c.id !== id));
      if (onNotify) onNotify('Canvas deleted successfully', 'info');
    } catch (err) {
      if (onNotify) onNotify(err.message || 'Failed to delete canvas', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCanvases = useMemo(() => {
    if (filterTab === 'mine') {
      return savedCanvases.filter((c) => c.isOwnedByMe);
    }
    if (filterTab === 'public') {
      return savedCanvases.filter((c) => c.isPublic);
    }
    return savedCanvases;
  }, [savedCanvases, filterTab]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              {mode === 'save' ? <Save size={16} /> : <FolderOpen size={16} />}
            </div>
            <span className="modal-title">
              {mode === 'save' ? 'Save Canvas to Cloud' : 'Cloud Canvases'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-3d btn-3d-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {mode === 'save' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="prop-label" style={{ display: 'block', marginBottom: '6px' }}>
                  Canvas Project Name
                </label>
                <input
                  type="text"
                  className="input-3d"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Modern Landing Banner"
                  autoFocus
                />
              </div>

              {/* Visibility Options */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isPublicInput ? (
                      <Globe size={18} color="var(--accent-emerald)" />
                    ) : (
                      <Lock size={18} color="var(--accent-primary)" />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {isPublicInput ? 'Public Canvas' : 'Private Canvas'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {isPublicInput
                          ? 'Anyone with link or browsing can view this canvas'
                          : 'Only you can view and edit this canvas'}
                      </div>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={isPublicInput}
                      onChange={(e) => setIsPublicInput(e.target.checked)}
                    />
                    <span className="slider-round" />
                  </label>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    paddingTop: '6px',
                    borderTop: '1px solid #e2e8f0',
                  }}
                >
                  <Layers size={14} color="var(--text-muted)" />
                  <span>
                    Contains <b>{elementsCount}</b> elements directly rendered in Konva.
                  </span>
                </div>
              </div>

              {/* Account Ownership Status Banner */}
              {isAuthenticated ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: '#166534',
                  }}
                >
                  <User size={15} />
                  <span>
                    Saving as owner: <b>{user?.name}</b> ({user?.email})
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: '#92400e',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={16} />
                    <span>Saving as Guest (unclaimed)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '12px',
                    }}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Filter Tabs */}
              <div className="canvas-filter-tabs">
                <button
                  className={`filter-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterTab('all')}
                >
                  All ({savedCanvases.length})
                </button>
                {isAuthenticated && (
                  <button
                    className={`filter-tab-btn ${filterTab === 'mine' ? 'active' : ''}`}
                    onClick={() => setFilterTab('mine')}
                  >
                    My Canvases ({savedCanvases.filter((c) => c.isOwnedByMe).length})
                  </button>
                )}
                <button
                  className={`filter-tab-btn ${filterTab === 'public' ? 'active' : ''}`}
                  onClick={() => setFilterTab('public')}
                >
                  Public ({savedCanvases.filter((c) => c.isPublic).length})
                </button>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                  <Loader2 className="status-dot saving" size={24} color="var(--accent-primary)" />
                  <span style={{ marginLeft: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Loading canvases from database...
                  </span>
                </div>
              ) : filteredCanvases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <FolderOpen size={36} strokeWidth={1.5} style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>No canvases found</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>
                    {filterTab === 'mine'
                      ? "You haven't saved any canvases under your account yet."
                      : 'Create some artwork and click "Save Canvas" to store it in MongoDB.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
                  {filteredCanvases.map((c) => {
                    const canvasId = c.id || c._id;
                    const dateFormatted = new Date(c.updatedAt || c.createdAt).toLocaleString();
                    const isMine = c.isOwnedByMe;

                    return (
                      <div
                        key={canvasId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          border: '1px solid #e2e8f0',
                          borderRadius: 'var(--radius-md)',
                          background: '#ffffff',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onClick={() => onLoadCanvas(canvasId)}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                              {c.name}
                            </span>
                            {isMine && (
                              <span className="badge-pill badge-mine">
                                <User size={10} /> Mine
                              </span>
                            )}
                            {c.isPublic ? (
                              <span className="badge-pill badge-public">
                                <Globe size={10} /> Public
                              </span>
                            ) : (
                              <span className="badge-pill badge-private">
                                <Lock size={10} /> Private
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: '12px',
                              color: 'var(--text-muted)',
                              marginTop: '4px',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Layers size={13} /> {c.elementCount ?? c.elements?.length ?? 0} elements
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={13} /> {dateFormatted}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="btn-3d btn-3d-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => onLoadCanvas(canvasId)}
                          >
                            Open
                          </button>
                          {isMine && (
                            <button
                              className="btn-3d btn-3d-icon"
                              style={{ width: '32px', height: '32px', color: '#f43f5e' }}
                              onClick={(e) => handleDelete(canvasId, e)}
                              disabled={deletingId === canvasId}
                              title="Delete canvas"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-3d btn-3d-secondary" onClick={onClose}>
            Cancel
          </button>
          {mode === 'save' && (
            <button
              className="btn-3d btn-3d-primary"
              onClick={() => onSaveSubmit(nameInput, isPublicInput)}
              disabled={!nameInput.trim()}
            >
              <Save size={15} />
              <span>Save Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
