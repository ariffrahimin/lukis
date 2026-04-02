
import { useState, useCallback, useRef, useEffect } from 'react';
import { type Node, type Edge } from '@xyflow/react';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export const useUndoRedo = (maxHistory: number = 50) => {
  const [state, setState] = useState<{
    history: HistoryState[];
    currentIndex: number;
  }>({
    history: [],
    currentIndex: -1,
  });

  const historyRef = useRef<HistoryState[]>([]);
  const currentIndexRef = useRef(-1);

  // Sync refs with state using useEffect
  useEffect(() => {
    historyRef.current = state.history;
    currentIndexRef.current = state.currentIndex;
  }, [state]);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  const saveState = useCallback((nodes: Node[], edges: Edge[]) => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      const clonedState = {
        nodes: structuredClone(nodes),
        edges: structuredClone(edges)
      };
      
      newHistory.push(clonedState);
      
      // Remove oldest entries if exceeding max history
      const processedHistory = newHistory.length > maxHistory 
        ? newHistory.slice(newHistory.length - maxHistory)
        : newHistory;
      
      return {
        history: processedHistory,
        currentIndex: processedHistory.length - 1
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      const newIndex = currentIndexRef.current - 1;
      setState(prev => ({ ...prev, currentIndex: newIndex }));
      return historyRef.current[newIndex];
    }
    return null;
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      const newIndex = currentIndexRef.current + 1;
      setState(prev => ({ ...prev, currentIndex: newIndex }));
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
