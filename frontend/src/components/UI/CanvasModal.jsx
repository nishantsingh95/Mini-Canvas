'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Save, Trash2, Calendar, Layers, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function CanvasModal({
  isOpen,
  mode, // 'save' | 'open'
  onClose,
  canvasName,
  onSaveSubmit,
  onLoadCanvas,
  elementsCount,
  onNotify,
}) {
  const [nameInput, setNameInput] = useState(canvasName);
  const [savedCanvases, setSavedCanvases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setNameInput(canvasName);
  }, [canvasName]);

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mode === 'save' ? <Save size={18} color="var(--accent-primary)" /> : <FolderOpen size={18} color="var(--accent-primary)" />}
            <span className="modal-title">
              {mode === 'save' ? 'Save Canvas to Cloud' : 'Saved Canvases'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

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

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Layers size={18} color="var(--text-muted)" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  This will store <b>{elementsCount}</b> elements directly to your MongoDB database.
                </span>
              </div>
            </div>
          ) : (
            <div>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                  <Loader2 className="status-dot saving" size={24} color="var(--accent-primary)" />
                  <span style={{ marginLeft: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Loading canvases from database...
                  </span>
                </div>
              ) : savedCanvases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <FolderOpen size={36} strokeWidth={1.5} style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>No saved canvases found</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>
                    Create some artwork and click &quot;Save Canvas&quot; to store it in MongoDB.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedCanvases.map((c) => {
                    const canvasId = c.id || c._id;
                    const dateFormatted = new Date(c.updatedAt || c.createdAt).toLocaleString();
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
                          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                            {c.name}
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
                          <button
                            className="btn-3d btn-3d-icon"
                            style={{ width: '32px', height: '32px', color: '#f43f5e' }}
                            onClick={(e) => handleDelete(canvasId, e)}
                            disabled={deletingId === canvasId}
                            title="Delete canvas"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-3d btn-3d-secondary" onClick={onClose}>
            Cancel
          </button>
          {mode === 'save' && (
            <button
              className="btn-3d btn-3d-primary"
              onClick={() => onSaveSubmit(nameInput)}
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
