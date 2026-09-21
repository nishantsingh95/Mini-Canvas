'use client';

import React from 'react';
import {
  Square,
  Circle,
  Type,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  Trash2,
} from 'lucide-react';

export default function LayersPanel({
  elements,
  selectedId,
  onSelect,
  onReorder,
  onToggleVisibility,
  onToggleLock,
  onDelete,
}) {
  // Elements are rendered bottom-to-top on canvas, so we reverse for standard layer display (top layer at top)
  const reversedElements = [...elements].reverse();

  if (elements.length === 0) {
    return (
      <div className="sidebar-content" style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>
        <p style={{ fontSize: '13px' }}>No layers yet</p>
        <p style={{ fontSize: '12px', marginTop: '6px' }}>Add shapes or text to create layers</p>
      </div>
    );
  }

  const selectedIndex = elements.findIndex((el) => el.id === selectedId);

  return (
    <div className="sidebar-content">
      {/* Layer Order Controls (enabled when element selected) */}
      <div className="prop-row" style={{ paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
        <span className="prop-label">Reorder</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn-3d btn-3d-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onReorder(selectedId, 'top')}
            disabled={!selectedId || selectedIndex === elements.length - 1}
            title="Bring to Front"
          >
            <ChevronsUp size={14} />
          </button>
          <button
            className="btn-3d btn-3d-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onReorder(selectedId, 'up')}
            disabled={!selectedId || selectedIndex === elements.length - 1}
            title="Move Up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            className="btn-3d btn-3d-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onReorder(selectedId, 'down')}
            disabled={!selectedId || selectedIndex === 0}
            title="Move Down"
          >
            <ChevronDown size={14} />
          </button>
          <button
            className="btn-3d btn-3d-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => onReorder(selectedId, 'bottom')}
            disabled={!selectedId || selectedIndex === 0}
            title="Send to Back"
          >
            <ChevronsDown size={14} />
          </button>
        </div>
      </div>

      {/* Layer items list */}
      <div className="layers-list">
        {reversedElements.map((el, i) => {
          const isSelected = el.id === selectedId;
          const Icon = el.type === 'circle' ? Circle : el.type === 'text' ? Type : Square;
          const label = el.type === 'text' ? (el.text || 'Text') : `${el.type.charAt(0).toUpperCase() + el.type.slice(1)} ${elements.length - i}`;

          return (
            <div
              key={el.id}
              className={`layer-item ${isSelected ? 'active' : ''}`}
              onClick={() => onSelect(el.id)}
            >
              <div className="layer-left">
                <Icon size={15} color={el.fill || '#6366f1'} />
                <span className="layer-name" title={label}>{label}</span>
              </div>

              <div className="layer-actions" onClick={(e) => e.stopPropagation()}>
                {/* Visibility Toggle */}
                <button
                  className={`layer-btn ${el.isVisible === false ? 'active' : ''}`}
                  onClick={() => onToggleVisibility(el.id)}
                  title={el.isVisible === false ? 'Show Layer' : 'Hide Layer'}
                >
                  {el.isVisible === false ? <EyeOff size={14} color="#f43f5e" /> : <Eye size={14} />}
                </button>

                {/* Lock Toggle */}
                <button
                  className={`layer-btn ${el.isLocked ? 'active' : ''}`}
                  onClick={() => onToggleLock(el.id)}
                  title={el.isLocked ? 'Unlock Layer' : 'Lock Layer'}
                >
                  {el.isLocked ? <Lock size={14} color="#f59e0b" /> : <Unlock size={14} />}
                </button>

                {/* Delete button */}
                <button
                  className="layer-btn"
                  onClick={() => onDelete(el.id)}
                  title="Delete Layer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
