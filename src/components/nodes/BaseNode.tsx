
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../../lib/utils';
import { type NodeType } from '../../types/diagrams';
import {
  Server,
  Database,
  Cloud,
  Monitor,
  HardDrive,
  Globe,
  Type,
  Square
} from 'lucide-react';

const nodeTypeStyles: Record<NodeType, { bg: string; border: string; icon: string }> = {
  service: {
    bg: 'bg-[hsl(187_72%_50%/0.15)]',
    border: 'border-[hsl(187_72%_50%/0.5)]',
    icon: 'text-[hsl(187_72%_50%)]'
  },
  database: {
    bg: 'bg-[hsl(262_83%_58%/0.15)]',
    border: 'border-[hsl(262_83%_58%/0.5)]',
    icon: 'text-[hsl(262_83%_58%)]'
  },
  server: {
    bg: 'bg-[hsl(142_71%_45%/0.15)]',
    border: 'border-[hsl(142_71%_45%/0.5)]',
    icon: 'text-[hsl(142_71%_45%)]'
  },
  client: {
    bg: 'bg-[hsl(38_92%_50%/0.15)]',
    border: 'border-[hsl(38_92%_50%/0.5)]',
    icon: 'text-[hsl(38_92%_50%)]'
  },
  storage: {
    bg: 'bg-[hsl(346_77%_50%/0.15)]',
    border: 'border-[hsl(346_77%_50%/0.5)]',
    icon: 'text-[hsl(346_77%_50%)]'
  },
  api: {
    bg: 'bg-[hsl(199_89%_48%/0.15)]',
    border: 'border-[hsl(199_89%_48%/0.5)]',
    icon: 'text-[hsl(199_89%_48%)]'
  },
  text: {
    bg: 'bg-transparent',
    border: 'border-transparent',
    icon: 'text-foreground'
  },
  group: {
    bg: 'bg-secondary/30',
    border: 'border-border border-dashed',
    icon: 'text-muted-foreground'
  },
};

const NodeIcon = ({ type, className }: { type: NodeType; className?: string }) => {
  const iconProps = { className: cn('w-5 h-5', className) };

  switch (type) {
    case 'service': return <Cloud {...iconProps} />;
    case 'database': return <Database {...iconProps} />;
    case 'server': return <Server {...iconProps} />;
    case 'client': return <Monitor {...iconProps} />;
    case 'storage': return <HardDrive {...iconProps} />;
    case 'api': return <Globe {...iconProps} />;
    case 'text': return <Type {...iconProps} />;
    case 'group': return <Square {...iconProps} />;
    default: return <Cloud {...iconProps} />;
  }
};

interface BaseNodeProps {
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    [key: string]: unknown;
  };
  selected?: boolean;
}

const BaseNode = ({ data, selected }: BaseNodeProps) => {
  const styles = nodeTypeStyles[data.nodeType];
  const isTextNode = data.nodeType === 'text';
  const isGroupNode = data.nodeType === 'group';

  if (isTextNode) {
    return (
      <div className="px-2 py-1 relative">
        <Handle 
          type="target" 
          position={Position.Top} 
          id="target-top"
          style={{ 
            background: 'red', 
            width: 8, 
            height: 8, 
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)'
          }} 
        />
        <Handle 
          type="target" 
          position={Position.Right} 
          id="target-right"
          style={{ 
            background: 'red', 
            width: 8, 
            height: 8, 
            right: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }} 
        />
        <Handle 
          type="target" 
          position={Position.Bottom} 
          id="target-bottom"
          style={{ 
            background: 'red', 
            width: 8, 
            height: 8, 
            bottom: -4,
            left: '50%',
            transform: 'translateX(-50%)'
          }} 
        />
        <Handle 
          type="target" 
          position={Position.Left} 
          id="target-left"
          style={{ 
            background: 'red', 
            width: 8, 
            height: 8, 
            left: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }} 
        />
        
        <Handle 
          type="source" 
          position={Position.Top} 
          id="source-top"
          style={{ 
            background: 'green', 
            width: 8, 
            height: 8, 
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)'
          }} 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          id="source-right"
          style={{ 
            background: 'green', 
            width: 8, 
            height: 8, 
            right: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }} 
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          id="source-bottom"
          style={{ 
            background: 'green', 
            width: 8, 
            height: 8, 
            bottom: -4,
            left: '50%',
            transform: 'translateX(-50%)'
          }} 
        />
        <Handle 
          type="source" 
          position={Position.Left} 
          id="source-left"
          style={{ 
            background: 'green', 
            width: 8, 
            height: 8, 
            left: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }} 
        />
        <span className="text-foreground font-medium text-sm">{data.label}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-w-[140px] rounded-lg border-2 backdrop-blur-sm transition-all duration-200',
        styles.bg,
        styles.border,
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        isGroupNode && 'min-w-[200px] min-h-[120px]'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        style={{ 
          background: 'red', 
          width: 8, 
          height: 8, 
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        style={{ 
          background: 'red', 
          width: 8, 
          height: 8, 
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        style={{ 
          background: 'red', 
          width: 8, 
          height: 8, 
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{ 
          background: 'red', 
          width: 8, 
          height: 8, 
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />

      <div className={cn('p-3', isGroupNode && 'pb-16')}>
        <div className="flex items-center gap-2">
          <NodeIcon type={data.nodeType} className={styles.icon} />
          <span className="font-medium text-sm text-foreground truncate max-w-[120px]">
            {data.label}
          </span>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[160px]">
            {data.description}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        style={{ 
          background: 'green', 
          width: 8, 
          height: 8, 
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{ 
          background: 'green', 
          width: 8, 
          height: 8, 
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        style={{ 
          background: 'green', 
          width: 8, 
          height: 8, 
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        style={{ 
          background: 'green', 
          width: 8, 
          height: 8, 
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
};

export default memo(BaseNode);
