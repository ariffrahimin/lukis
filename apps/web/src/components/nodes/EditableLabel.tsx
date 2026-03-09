import { useState, useRef, useEffect, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { cn } from "../../lib/utils";

interface EditableLabelProps {
  label: string;
  nodeId: string;
  className?: string;
}

export const EditableLabel = ({ label, nodeId, className }: EditableLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    setValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitEdit = useCallback(() => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== label) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: trimmed } } : n
        )
      );
    } else {
      setValue(label);
    }
  }, [value, label, nodeId, setNodes]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitEdit();
          if (e.key === "Escape") {
            setValue(label);
            setIsEditing(false);
          }
          e.stopPropagation();
        }}
        className={cn(
          "bg-transparent border-b border-primary outline-none text-center w-full",
          className
        )}
        style={{ minWidth: 30 }}
      />
    );
  }

  return (
    <span
      className={className}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Double-click to edit"
    >
      {label}
    </span>
  );
};
