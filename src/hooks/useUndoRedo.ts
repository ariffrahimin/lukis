
import { useState, useCallback, useRef } from 'react';
import { type Node, type Edge } from '@xyflow/react';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export const useUndoRedo = (maxHistory: number = 50) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const historyRef = useRef<HistoryState[]>([]);
  const currentIndexRef = useRef(-1);

  // Update refs when state changes
  historyRef.current = history;
  currentIndexRef.current = currentIndex;

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const saveState = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setCurrentIndex((prev) => {
      const newIndex = Math.min(prev + 1, maxHistory - 1);
      return newIndex;
    });
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      const newIndex = currentIndexRef.current - 1;
      setCurrentIndex(newIndex);
      return historyRef.current[newIndex];
    }
    return null;
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      const newIndex = currentIndexRef.current + 1;
      setCurrentIndex(newIndex);
      return historyRef.current[newIndex];
    }
    return null;
  }, []);

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
