'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/UI/Navbar';
import Toolbar from '@/components/UI/Toolbar';
import PropertiesPanel from '@/components/UI/PropertiesPanel';
import LayersPanel from '@/components/UI/LayersPanel';
import CanvasModal from '@/components/UI/CanvasModal';
import AuthModal from '@/components/UI/AuthModal';
import Toast from '@/components/UI/Toast';
import CanvasContainer from '@/components/Canvas/CanvasContainer';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { api } from '@/services/api';
import { Sliders, Layers } from 'lucide-react';

// Starter elements for an eye-catching default 3D canvas
const INITIAL_DEMO_ELEMENTS = [
  {
    id: 'demo-card-bg',
    type: 'rect',
    x: 350,
    y: 160,
    width: 500,
    height: 380,
    fill: '#ffffff',
    stroke: '#e2e8f0',
    strokeWidth: 2,
    cornerRadius: 20,
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
  },
  {
    id: 'demo-accent-circle',
    type: 'circle',
    x: 430,
    y: 250,
    radius: 45,
    fill: '#6366f1',
    stroke: '#4338ca',
    strokeWidth: 0,
    rotation: 0,
    opacity: 0.9,
    isLocked: false,
    isVisible: true,
  },
  {
    id: 'demo-title-text',
    type: 'text',
    x: 500,
    y: 230,
    text: 'Clean 3D Studio',
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fill: '#0f172a',
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
  },
  {
    id: 'demo-subtitle-text',
    type: 'text',
    x: 502,
    y: 275,
    text: 'Interactive Canvas with Next.js & React Konva',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fill: '#64748b',
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
  },
  {
    id: 'demo-pill-btn',
    type: 'rect',
    x: 500,
    y: 340,
    width: 170,
    height: 48,
    fill: '#6366f1',
    stroke: '#3730a3',
    strokeWidth: 0,
    cornerRadius: 24,
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
  },
  {
    id: 'demo-pill-label',
    type: 'text',
    x: 535,
    y: 354,
    text: 'Get Started',
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fill: '#ffffff',
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
  },
];

export default function CanvasPage() {
  const [canvasId, setCanvasId] = useState(null);
  const [canvasName, setCanvasName] = useState('Clean 3D Canvas');
  const [canvasBg, setCanvasBg] = useState('#f8fafc');
  const [canvasIsPublic, setCanvasIsPublic] = useState(false);
  const [canvasWidth] = useState(1200);
  const [canvasHeight] = useState(800);

  const {
    elements,
    setElements,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useCanvasHistory(INITIAL_DEMO_ELEMENTS);

  const [selectedId, setSelectedId] = useState('demo-card-bg');
  const [activeTool, setActiveTool] = useState('select');
  const [sidebarTab, setSidebarTab] = useState('properties'); // 'properties' | 'layers'
  const [zoom, setZoom] = useState(1);
  const [gridType, setGridType] = useState('dots'); // 'dots' | 'isometric'
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'unsaved' | 'saving'
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'save' });
  const [toasts, setToasts] = useState([]);

  const stageRef = useRef(null);

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Update save status whenever elements or metadata change
  const markDirty = useCallback(() => {
    setSaveStatus('unsaved');
  }, []);

  // Autosave when canvas is modified and has a cloud ID
  useEffect(() => {
    if (!autoSaveEnabled || !canvasId || saveStatus !== 'unsaved') return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await api.updateCanvas(canvasId, {
          name: canvasName,
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: canvasBg,
          elements,
          isPublic: canvasIsPublic,
        });
        setSaveStatus('saved');
      } catch (err) {
        console.warn('Autosave error:', err);
        setSaveStatus('unsaved');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [autoSaveEnabled, canvasId, saveStatus, canvasName, canvasWidth, canvasHeight, canvasBg, elements, canvasIsPublic]);

  // Add Rectangle
  const handleAddRectangle = useCallback(() => {
    const id = 'rect-' + Math.random().toString(36).substring(2, 9);
    const newRect = {
      id,
      type: 'rect',
      x: 300 + Math.floor(Math.random() * 80),
      y: 200 + Math.floor(Math.random() * 80),
      width: 180,
      height: 120,
      fill: '#6366f1',
      stroke: '#4338ca',
      strokeWidth: 0,
      cornerRadius: 12,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isVisible: true,
    };
    setElements((prev) => [...prev, newRect]);
    setSelectedId(id);
    markDirty();
    notify('Rectangle added to canvas', 'info');
  }, [setElements, markDirty, notify]);

  // Add Circle
  const handleAddCircle = useCallback(() => {
    const id = 'circle-' + Math.random().toString(36).substring(2, 9);
    const newCircle = {
      id,
      type: 'circle',
      x: 400 + Math.floor(Math.random() * 80),
      y: 250 + Math.floor(Math.random() * 80),
      radius: 60,
      fill: '#ec4899',
      stroke: '#db2777',
      strokeWidth: 0,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isVisible: true,
    };
    setElements((prev) => [...prev, newCircle]);
    setSelectedId(id);
    markDirty();
    notify('Circle added to canvas', 'info');
  }, [setElements, markDirty, notify]);

  // Add Text
  const handleAddText = useCallback(() => {
    const id = 'text-' + Math.random().toString(36).substring(2, 9);
    const newText = {
      id,
      type: 'text',
      x: 350 + Math.floor(Math.random() * 80),
      y: 250 + Math.floor(Math.random() * 80),
      text: 'Creative 3D Typography',
      fontSize: 28,
      fontWeight: 'bold',
      fontStyle: 'normal',
      align: 'left',
      fill: '#1e293b',
      stroke: '#000000',
      strokeWidth: 0,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isVisible: true,
    };
    setElements((prev) => [...prev, newText]);
    setSelectedId(id);
    markDirty();
    notify('Text element added', 'info');
  }, [setElements, markDirty, notify]);

  // Duplicate Selected Element
  const handleDuplicateSelected = useCallback(() => {
    if (!selectedId) return;
    const target = elements.find((el) => el.id === selectedId);
    if (!target) return;

    const newId = `${target.type}-${Math.random().toString(36).substring(2, 9)}`;
    const cloned = {
      ...target,
      id: newId,
      x: target.x + 30,
      y: target.y + 30,
    };

    setElements((prev) => [...prev, cloned]);
    setSelectedId(newId);
    markDirty();
    notify('Element duplicated', 'info');
  }, [selectedId, elements, setElements, markDirty, notify]);

  // Delete Selected Element
  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    markDirty();
    notify('Element deleted', 'info');
  }, [selectedId, setElements, markDirty, notify]);

  // Delete by specific ID
  const handleDeleteById = useCallback((id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    markDirty();
    notify('Layer deleted', 'info');
  }, [selectedId, setElements, markDirty, notify]);

  // Update selected element property directly
  const handleUpdateElement = useCallback((patch) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...patch } : el))
    );
    markDirty();
  }, [selectedId, setElements, markDirty]);

  // Commit transform or drag change to history
  const handleCommitChange = useCallback((id, patch) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...patch } : el)),
      true
    );
    markDirty();
  }, [setElements, markDirty]);

  // Reorder layers
  const handleReorderLayer = useCallback((id, direction) => {
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);

      if (direction === 'top') {
        copy.push(item);
      } else if (direction === 'bottom') {
        copy.unshift(item);
      } else if (direction === 'up') {
        const targetIdx = Math.min(copy.length, idx + 1);
        copy.splice(targetIdx, 0, item);
      } else if (direction === 'down') {
        const targetIdx = Math.max(0, idx - 1);
        copy.splice(targetIdx, 0, item);
      }
      return copy;
    });
    markDirty();
  }, [setElements, markDirty]);

  // Toggle layer visibility
  const handleToggleVisibility = useCallback((id) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, isVisible: el.isVisible === false ? true : false } : el
      )
    );
    markDirty();
  }, [setElements, markDirty]);

  // Toggle layer lock
  const handleToggleLock = useCallback((id) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isLocked: !el.isLocked } : el))
    );
    markDirty();
  }, [setElements, markDirty]);

  // New blank canvas
  const handleNewCanvas = useCallback(() => {
    if (elements.length > 0 && saveStatus === 'unsaved') {
      if (!window.confirm('Create new canvas? Any unsaved changes will be cleared.')) return;
    }
    setCanvasId(null);
    setCanvasName('New Design Canvas');
    setCanvasBg('#ffffff');
    setCanvasIsPublic(false);
    resetHistory([]);
    setSelectedId(null);
    setSaveStatus('saved');
    notify('Created new blank canvas', 'info');
  }, [elements.length, saveStatus, resetHistory, notify]);

  // Save Canvas
  const handleOpenSaveModal = () => {
    setModalState({ isOpen: true, mode: 'save' });
  };

  const handleSaveSubmit = async (name, isPublic = false) => {
    setSaveStatus('saving');
    setModalState({ isOpen: false, mode: 'save' });

    const payload = {
      name: name.trim() || 'Untitled Canvas',
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: canvasBg,
      elements,
      isPublic: Boolean(isPublic),
    };

    try {
      if (canvasId) {
        await api.updateCanvas(canvasId, payload);
        setCanvasName(payload.name);
        setCanvasIsPublic(Boolean(isPublic));
        setSaveStatus('saved');
        notify('Canvas updated in cloud database!', 'success');
      } else {
        const created = await api.createCanvas(payload);
        setCanvasId(created.id || created._id);
        setCanvasName(payload.name);
        setCanvasIsPublic(Boolean(isPublic));
        setSaveStatus('saved');
        notify('New canvas saved to MongoDB!', 'success');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('unsaved');
      notify(err.message || 'Failed to save canvas', 'error');
    }
  };

  // Load Canvas
  const handleLoadCanvas = async (id) => {
    try {
      setModalState({ isOpen: false, mode: 'open' });
      const loaded = await api.getCanvasById(id);
      setCanvasId(loaded.id || loaded._id);
      setCanvasName(loaded.name || 'Untitled Canvas');
      setCanvasBg(loaded.backgroundColor || '#ffffff');
      setCanvasIsPublic(Boolean(loaded.isPublic));
      resetHistory(loaded.elements || []);
      setSelectedId(null);
      setSaveStatus('saved');
      notify(`Loaded "${loaded.name}"`, 'success');
    } catch (err) {
      console.error(err);
      notify(err.message || 'Failed to load canvas', 'error');
    }
  };

  // Export High-Res PNG
  const handleExportPNG = useCallback(() => {
    if (!stageRef.current) return;
    // Deselect shape momentarily for clean export
    setSelectedId(null);

    setTimeout(() => {
      try {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `${canvasName.replace(/\s+/g, '-').toLowerCase() || 'canvas'}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify('High-resolution PNG exported!', 'success');
      } catch (err) {
        console.error(err);
        notify('Failed to export image', 'error');
      }
    }, 50);
  }, [canvasName, notify]);

  // Export JSON
  const handleExportJSON = useCallback(() => {
    const data = {
      name: canvasName,
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: canvasBg,
      elements,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${canvasName.replace(/\s+/g, '-').toLowerCase() || 'canvas'}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify('Canvas JSON exported', 'success');
  }, [canvasName, canvasWidth, canvasHeight, canvasBg, elements, notify]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If typing in input or textarea, skip global hotkeys
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }

      // Undo: Ctrl+Z (without shift)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
        return;
      }

      // Save: Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleOpenSaveModal();
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteSelected();
        return;
      }

      // Quick Tools: R (Rectangle), O (Circle), T (Text), V (Select)
      if (e.key.toLowerCase() === 'r') {
        handleAddRectangle();
      } else if (e.key.toLowerCase() === 'o') {
        handleAddCircle();
      } else if (e.key.toLowerCase() === 't') {
        handleAddText();
      } else if (e.key.toLowerCase() === 'v') {
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    handleDuplicateSelected,
    handleDeleteSelected,
    handleAddRectangle,
    handleAddCircle,
    handleAddText,
  ]);

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        canvasName={canvasName}
        onNameChange={(val) => {
          setCanvasName(val);
          markDirty();
        }}
        saveStatus={saveStatus}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onNewCanvas={handleNewCanvas}
        onOpenModal={() => setModalState({ isOpen: true, mode: 'open' })}
        onSave={handleOpenSaveModal}
        onExportPNG={handleExportPNG}
        onExportJSON={handleExportJSON}
        autoSaveEnabled={autoSaveEnabled}
      />

      {/* Main Workspace Area */}
      <div className="workspace-area">
        {/* Floating Tools Palette */}
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onAddRectangle={handleAddRectangle}
          onAddCircle={handleAddCircle}
          onAddText={handleAddText}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateSelected={handleDuplicateSelected}
          hasSelection={Boolean(selectedId)}
          zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
          onZoomOut={() => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))}
          onResetZoom={() => setZoom(1)}
          gridType={gridType}
          onToggleGrid={() => setGridType((g) => (g === 'dots' ? 'isometric' : 'dots'))}
        />

        {/* Central Canvas Viewport */}
        <main className={`canvas-viewport ${gridType === 'isometric' ? 'isometric-grid' : ''}`}>
          <div className="canvas-stage-wrapper">
            <CanvasContainer
              stageRef={stageRef}
              elements={elements}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              onUpdateElement={handleUpdateElement}
              onCommitChange={handleCommitChange}
              width={canvasWidth}
              height={canvasHeight}
              backgroundColor={canvasBg}
              zoom={zoom}
            />
          </div>
        </main>

        {/* Right Sidebar: Properties & Layers */}
        <aside className="sidebar-panel">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${sidebarTab === 'properties' ? 'active' : ''}`}
              onClick={() => setSidebarTab('properties')}
            >
              <Sliders size={14} />
              <span>Properties</span>
            </button>
            <button
              className={`sidebar-tab ${sidebarTab === 'layers' ? 'active' : ''}`}
              onClick={() => setSidebarTab('layers')}
            >
              <Layers size={14} />
              <span>Layers ({elements.length})</span>
            </button>
          </div>

          {sidebarTab === 'properties' ? (
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              canvasBg={canvasBg}
              onUpdateCanvasBg={(bg) => {
                setCanvasBg(bg);
                markDirty();
              }}
              isPublic={canvasIsPublic}
              onTogglePublic={(val) => {
                setCanvasIsPublic(val);
                markDirty();
              }}
              autoSaveEnabled={autoSaveEnabled}
              onToggleAutoSave={(val) => {
                setAutoSaveEnabled(val);
                notify(val ? 'Autosave enabled' : 'Autosave disabled', 'info');
              }}
            />
          ) : (
            <LayersPanel
              elements={elements}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              onReorder={handleReorderLayer}
              onToggleVisibility={handleToggleVisibility}
              onToggleLock={handleToggleLock}
              onDelete={handleDeleteById}
            />
          )}
        </aside>
      </div>

      {/* Save & Open Canvases Modal */}
      <CanvasModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        onClose={() => setModalState({ isOpen: false, mode: 'save' })}
        canvasName={canvasName}
        initialIsPublic={canvasIsPublic}
        onSaveSubmit={handleSaveSubmit}
        onLoadCanvas={handleLoadCanvas}
        elementsCount={elements.length}
        onNotify={notify}
      />

      {/* Authentication Modal */}
      <AuthModal onNotify={notify} />

      {/* Floating 3D Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
