import { memo, useState, useRef, useEffect, useCallback } from "react";
import { NodeResizer, useReactFlow } from "@xyflow/react";
import { type NodeType } from "../../types/diagrams";
import { NodeHandles } from "./NodeHandles";

const STICKY_COLORS = [
  { name: "Yellow", bg: "#FEF08A", fold: "#EAB308", text: "#713F12" },
  { name: "Pink", bg: "#FBCFE8", fold: "#EC4899", text: "#831843" },
  { name: "Blue", bg: "#BFDBFE", fold: "#3B82F6", text: "#1E3A5F" },
  { name: "Green", bg: "#BBF7D0", fold: "#22C55E", text: "#14532D" },
  { name: "Orange", bg: "#FED7AA", fold: "#F97316", text: "#7C2D12" },
  { name: "Purple", bg: "#DDD6FE", fold: "#8B5CF6", text: "#3B0764" },
];

interface StickyNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    stickyColor?: string;
    [key: string]: unknown;
  };
  selected?: boolean;
}

const StickyNode = ({ id, data, selected }: StickyNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data.label || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setNodes } = useReactFlow();
  const handlesVisible = !!(selected || isHovered);

  const colorIndex = parseInt(data.stickyColor || "0") % STICKY_COLORS.length;
  const color = STICKY_COLORS[colorIndex];

  useEffect(() => {
    setValue(data.label || "");
  }, [data.label]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const commitEdit = useCallback(() => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== data.label) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, label: trimmed } } : n
        )
      );
    } else {
      setValue(data.label || "");
    }
  }, [value, data.label, id, setNodes]);

  const foldSize = 18;

  return (
    <div
      className="w-full h-full relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.10)) drop-shadow(0 1px 2px rgba(0,0,0,0.06))" }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={120}
        lineStyle={{ borderColor: "#3b82f6" }}
        handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
      />
      <NodeHandles visible={handlesVisible} />

      {/* Main sticky body with clipped corner */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <clipPath id={`sticky-clip-${id}`}>
            <polygon points={`0,0 100,0 100,${100 - foldSize} ${100 - foldSize},100 0,100`} />
          </clipPath>
        </defs>
        <rect
          x="0" y="0" width="100" height="100"
          fill={color.bg}
          clipPath={`url(#sticky-clip-${id})`}
        />
        {/* Fold triangle */}
        <polygon
          points={`100,${100 - foldSize} ${100 - foldSize},100 ${100 - foldSize},${100 - foldSize}`}
          fill={color.fold}
          opacity="0.35"
        />
      </svg>

      {/* Selection ring */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            boxShadow: `0 0 0 2px #3b82f6`,
          }}
        />
      )}

      {/* Text content area */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setValue(data.label || "");
                setIsEditing(false);
              }
              e.stopPropagation();
            }}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-center"
            style={{
              color: color.text,
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              fontFamily: "'Segoe Print', 'Bradley Hand', 'Marker Felt', cursive",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              paddingTop: "30%",
            }}
          />
        ) : (
          <span
            className="select-none cursor-default break-words overflow-hidden text-center w-full"
            style={{
              color: color.text,
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              fontFamily: "'Segoe Print', 'Bradley Hand', 'Marker Felt', cursive",
              wordBreak: "break-word",
            }}
            title="Double-click to edit"
          >
            {data.label || "Sticky Note"}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(StickyNode);
