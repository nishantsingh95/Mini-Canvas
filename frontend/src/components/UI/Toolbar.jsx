'use client';

import React from 'react';
import {
  MousePointer,
  Square,
  Circle,
  Type,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
} from 'lucide-react';

export default function Toolbar({
  activeTool,
  setActiveTool,
  onAddRectangle,
  onAddCircle,
  onAddText,
  onDeleteSelected,
  onDuplicateSelected,
  hasSelection,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  gridType,
  onToggleGrid,
}) {
  return (
    <>
      {/* Floating Left Creation & Tool Palette */}
      <aside className="floating-toolbar">
        <button
          className={`btn-3d btn-3d-icon ${activeTool === 'select' ? 'active' : ''}`}
          onClick={() => setActiveTool('select')}
          title="Select & Transform (V)"
        >
          <MousePointer size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          className="btn-3d btn-3d-icon"
          onClick={onAddRectangle}
          title="Add Rectangle (R)"
        >
          <Square size={18} />
        </button>

        <button
          className="btn-3d btn-3d-icon"
          onClick={onAddCircle}
          title="Add Circle (O)"
        >
          <Circle size={18} />
        </button>

        <button
          className="btn-3d btn-3d-icon"
          onClick={onAddText}
          title="Add Text (T)"
        >
          <Type size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          className="btn-3d btn-3d-icon"
          onClick={onDuplicateSelected}
          disabled={!hasSelection}
          title="Duplicate Element (Ctrl+D)"
        >
          <Copy size={18} />
        </button>

        <button
          className="btn-3d btn-3d-icon"
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          title="Delete Element (Del / Backspace)"
          style={hasSelection ? { color: '#f43f5e' } : {}}
        >
          <Trash2 size={18} />
        </button>
      </aside>

      {/* Floating Bottom Zoom & View Toolbar */}
      <div className="zoom-controls">
        <button
          className="btn-3d btn-3d-icon"
          onClick={onZoomOut}
          title="Zoom Out"
          style={{ width: '28px', height: '28px' }}
        >
          <ZoomOut size={14} />
        </button>

        <span className="zoom-label">{Math.round(zoom * 100)}%</span>

        <button
          className="btn-3d btn-3d-icon"
          onClick={onZoomIn}
          title="Zoom In"
          style={{ width: '28px', height: '28px' }}
        >
          <ZoomIn size={14} />
        </button>

        <button
          className="btn-3d btn-3d-icon"
          onClick={onResetZoom}
          title="Reset View to 100%"
          style={{ width: '28px', height: '28px' }}
        >
          <Maximize2 size={14} />
        </button>

        <div style={{ width: '1px', height: '16px', background: '#cbd5e1', margin: '0 2px' }} />

        <button
          className={`btn-3d btn-3d-icon ${gridType === 'isometric' ? 'active' : ''}`}
          onClick={onToggleGrid}
          title={`Switch Grid (Current: ${gridType})`}
          style={{ width: '28px', height: '28px' }}
        >
          <Grid size={14} />
        </button>
      </div>
    </>
  );
}
