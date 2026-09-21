'use client';

import { useState, useCallback, useRef } from 'react';

export function useCanvasHistory(initialElements = []) {
  const [history, setHistory] = useState([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Keep a ref to avoid stale closure during rapid updates
  const historyRef = useRef(history);
  historyRef.current = history;
  const indexRef = useRef(historyIndex);
  indexRef.current = historyIndex;

  const currentElements = history[historyIndex] || [];

  const setElementsWithHistory = useCallback((newElementsOrFn, recordHistory = true) => {
    setHistory((prevHistory) => {
      const curIndex = indexRef.current;
      const current = prevHistory[curIndex] || [];
      const updated = typeof newElementsOrFn === 'function' ? newElementsOrFn(current) : newElementsOrFn;

      if (!recordHistory) {
        // In-place update without creating history entry (e.g., intermediate drag)
        const copy = [...prevHistory];
        copy[curIndex] = updated;
        return copy;
      }

      // Truncate future history
      const newHist = prevHistory.slice(0, curIndex + 1);
      newHist.push(updated);
      
      // Limit history to 50 steps
      if (newHist.length > 50) {
        newHist.shift();
      }
      
      return newHist;
    });

    if (recordHistory) {
      setHistoryIndex((prevIndex) => Math.min(prevIndex + 1, 49));
    }
  }, []);

  const undo = useCallback(() => {
    setHistoryIndex((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setHistoryIndex((prev) => {
      if (prev < historyRef.current.length - 1) return prev + 1;
      return prev;
    });
  }, []);

  const resetHistory = useCallback((newInitialElements = []) => {
    setHistory([newInitialElements]);
    setHistoryIndex(0);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    elements: currentElements,
    setElements: setElementsWithHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
}
