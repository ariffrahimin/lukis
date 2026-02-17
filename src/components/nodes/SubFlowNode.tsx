import { memo, useState } from "react";
import { NodeResizer } from "@xyflow/react";
import { cn } from "../../lib/utils";
import { type NodeType } from "../../types/diagrams";
import { NodeHandles } from "./NodeHandles";
import { EditableLabel } from "./EditableLabel";
import { BoxSelect } from "lucide-react";

interface SubFlowNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    [key: string]: unknown;
  };
  selected?: boolean;
}

const SubFlowNode = ({ id, data, selected }: SubFlowNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const handlesVisible = !!(selected || isHovered);

  return (
    <div
      className={cn(
        "w-full h-full rounded-lg border-2 border-dashed transition-all duration-200",
        "bg-secondary/20 border-border",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={300}
        minHeight={200}
        lineStyle={{ borderColor: "#3b82f6" }}
        handleStyle={{ backgroundColor: "#3b82f6", width: 8, height: 8 }}
      />
      <NodeHandles visible={handlesVisible} />
      <div className="p-3">
        <div className="flex items-center gap-2">
          <BoxSelect className="w-4 h-4 text-muted-foreground shrink-0" />
          <EditableLabel
            label={data.label}
            nodeId={id}
            className="font-medium text-sm text-muted-foreground truncate max-w-[160px]"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SubFlowNode);
