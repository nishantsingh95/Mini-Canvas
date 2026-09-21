'use client';

import React from 'react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Layers,
  RotateCw,
} from 'lucide-react';

const PRESET_PALETTE = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#1e293b', // Slate Dark
  '#ffffff', // Clean White
];

export default function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  canvasBg,
  onUpdateCanvasBg,
}) {
  if (!selectedElement) {
    return (
      <div className="sidebar-content">
        <div className="prop-section">
          <div className="prop-title">
            <span>Canvas Settings</span>
          </div>

          <div className="prop-row">
            <span className="prop-label">Background Color</span>
            <div className="color-input-row">
              <input
                type="color"
                className="color-picker-input"
                value={canvasBg}
                onChange={(e) => onUpdateCanvasBg(e.target.value)}
              />
              <input
                type="text"
                className="input-3d"
                style={{ width: '85px', fontFamily: 'var(--font-mono)' }}
                value={canvasBg}
                onChange={(e) => onUpdateCanvasBg(e.target.value)}
              />
            </div>
          </div>

          <div className="color-swatches">
            {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#0f172a', '#1e293b'].map((c) => (
              <button
                key={c}
                className={`swatch-btn ${canvasBg.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => onUpdateCanvasBg(c)}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="prop-section">
          <div className="prop-title">
            <span>Quick Tips</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <p>• <b>Click</b> a shape to select and drag it.</p>
            <p>• <b>Resize & Rotate</b> using the bounding box handles.</p>
            <p>• <b>Ctrl+Z / Ctrl+Y</b> to undo and redo edits.</p>
            <p>• <b>Del / Backspace</b> to delete selected item.</p>
            <p>• <b>Ctrl+D</b> to quickly duplicate.</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    type,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    radius = 50,
    rotation = 0,
    fill = '#6366f1',
    stroke = '#4338ca',
    strokeWidth = 0,
    opacity = 1,
    text = '',
    fontSize = 24,
    fontWeight = 'normal',
    fontStyle = 'normal',
    align = 'left',
  } = selectedElement;

  const handleNumChange = (prop, val) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      onUpdateElement({ [prop]: Math.round(parsed) });
    }
  };

  return (
    <div className="sidebar-content">
      {/* Geometry / Dimensions Section */}
      <div className="prop-section">
        <div className="prop-title">
          <span>Transform & Position</span>
          <span style={{ textTransform: 'capitalize', color: 'var(--accent-primary)', fontSize: '11px' }}>
            {type}
          </span>
        </div>

        <div className="prop-grid-2">
          <div className="input-with-icon">
            <span>X</span>
            <input
              type="number"
              className="input-3d"
              value={Math.round(x)}
              onChange={(e) => handleNumChange('x', e.target.value)}
            />
          </div>
          <div className="input-with-icon">
            <span>Y</span>
            <input
              type="number"
              className="input-3d"
              value={Math.round(y)}
              onChange={(e) => handleNumChange('y', e.target.value)}
            />
          </div>
        </div>

        {type === 'circle' ? (
          <div className="input-with-icon">
            <span>R</span>
            <input
              type="number"
              className="input-3d"
              value={Math.round(radius)}
              onChange={(e) => handleNumChange('radius', Math.max(5, e.target.value))}
            />
          </div>
        ) : (
          <div className="prop-grid-2">
            <div className="input-with-icon">
              <span>W</span>
              <input
                type="number"
                className="input-3d"
                value={Math.round(width)}
                onChange={(e) => handleNumChange('width', Math.max(5, e.target.value))}
              />
            </div>
            <div className="input-with-icon">
              <span>H</span>
              <input
                type="number"
                className="input-3d"
                value={Math.round(height)}
                onChange={(e) => handleNumChange('height', Math.max(5, e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Rotation */}
        <div className="prop-row" style={{ marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RotateCw size={14} color="var(--text-muted)" />
            <span className="prop-label">Rotation</span>
          </div>
          <div className="input-with-icon" style={{ width: '80px' }}>
            <span>°</span>
            <input
              type="number"
              className="input-3d"
              value={Math.round(rotation) % 360}
              onChange={(e) => handleNumChange('rotation', e.target.value)}
            />
          </div>
        </div>
        <input
          type="range"
          className="slider-3d"
          min="0"
          max="360"
          value={Math.round(rotation) % 360}
          onChange={(e) => handleNumChange('rotation', e.target.value)}
        />
      </div>

      {/* Text Specific Settings */}
      {type === 'text' && (
        <div className="prop-section">
          <div className="prop-title">
            <span>Typography</span>
          </div>

          <textarea
            className="input-3d"
            rows="3"
            value={text}
            onChange={(e) => onUpdateElement({ text: e.target.value })}
            placeholder="Type text content here..."
            style={{ resize: 'vertical' }}
          />

          <div className="prop-row">
            <span className="prop-label">Font Size</span>
            <div className="input-with-icon" style={{ width: '80px' }}>
              <span>px</span>
              <input
                type="number"
                className="input-3d"
                value={fontSize}
                onChange={(e) => handleNumChange('fontSize', Math.max(8, e.target.value))}
              />
            </div>
          </div>
          <input
            type="range"
            className="slider-3d"
            min="10"
            max="120"
            value={fontSize}
            onChange={(e) => handleNumChange('fontSize', e.target.value)}
          />

          {/* Formatting Controls */}
          <div className="prop-row" style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn-3d btn-3d-icon ${fontWeight === 'bold' ? 'active' : ''}`}
                onClick={() => onUpdateElement({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })}
                style={{ width: '32px', height: '32px' }}
                title="Bold"
              >
                <Bold size={14} />
              </button>
              <button
                className={`btn-3d btn-3d-icon ${fontStyle === 'italic' ? 'active' : ''}`}
                onClick={() => onUpdateElement({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })}
                style={{ width: '32px', height: '32px' }}
                title="Italic"
              >
                <Italic size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn-3d btn-3d-icon ${align === 'left' ? 'active' : ''}`}
                onClick={() => onUpdateElement({ align: 'left' })}
                style={{ width: '32px', height: '32px' }}
                title="Align Left"
              >
                <AlignLeft size={14} />
              </button>
              <button
                className={`btn-3d btn-3d-icon ${align === 'center' ? 'active' : ''}`}
                onClick={() => onUpdateElement({ align: 'center' })}
                style={{ width: '32px', height: '32px' }}
                title="Align Center"
              >
                <AlignCenter size={14} />
              </button>
              <button
                className={`btn-3d btn-3d-icon ${align === 'right' ? 'active' : ''}`}
                onClick={() => onUpdateElement({ align: 'right' })}
                style={{ width: '32px', height: '32px' }}
                title="Align Right"
              >
                <AlignRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fill Color Section */}
      <div className="prop-section">
        <div className="prop-title">
          <span>Fill Color</span>
        </div>

        <div className="prop-row">
          <span className="prop-label">Color</span>
          <div className="color-input-row">
            <input
              type="color"
              className="color-picker-input"
              value={fill.startsWith('#') ? fill : '#6366f1'}
              onChange={(e) => onUpdateElement({ fill: e.target.value })}
            />
            <input
              type="text"
              className="input-3d"
              style={{ width: '85px', fontFamily: 'var(--font-mono)' }}
              value={fill}
              onChange={(e) => onUpdateElement({ fill: e.target.value })}
            />
          </div>
        </div>

        <div className="color-swatches">
          {PRESET_PALETTE.map((color) => (
            <button
              key={color}
              className={`swatch-btn ${fill.toLowerCase() === color.toLowerCase() ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onUpdateElement({ fill: color })}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Stroke Section */}
      <div className="prop-section">
        <div className="prop-title">
          <span>Border / Stroke</span>
        </div>

        <div className="prop-row">
          <span className="prop-label">Stroke Color</span>
          <div className="color-input-row">
            <input
              type="color"
              className="color-picker-input"
              value={stroke.startsWith('#') ? stroke : '#334155'}
              onChange={(e) => onUpdateElement({ stroke: e.target.value })}
            />
            <input
              type="text"
              className="input-3d"
              style={{ width: '85px', fontFamily: 'var(--font-mono)' }}
              value={stroke}
              onChange={(e) => onUpdateElement({ stroke: e.target.value })}
            />
          </div>
        </div>

        <div className="prop-row" style={{ marginTop: '6px' }}>
          <span className="prop-label">Width</span>
          <div className="input-with-icon" style={{ width: '70px' }}>
            <span>px</span>
            <input
              type="number"
              className="input-3d"
              value={strokeWidth}
              onChange={(e) => handleNumChange('strokeWidth', Math.max(0, e.target.value))}
            />
          </div>
        </div>
        <input
          type="range"
          className="slider-3d"
          min="0"
          max="24"
          value={strokeWidth}
          onChange={(e) => handleNumChange('strokeWidth', e.target.value)}
        />
      </div>

      {/* Opacity Section */}
      <div className="prop-section">
        <div className="prop-title">
          <span>Opacity</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            {Math.round(opacity * 100)}%
          </span>
        </div>

        <input
          type="range"
          className="slider-3d"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
}
