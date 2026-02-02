import { memo, useState } from 'react';
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

// Cloud service icon mapping
const cloudServiceIcons: Record<string, string> = {
  'gcp-cloud-run': '/src/components/cloud-services/gcp/cloud-run.svg',
  'gcp-cloud-storage': '/src/components/cloud-services/gcp/cloud-storage.svg',
  'gcp-bigquery': '/src/components/cloud-services/gcp/bigquery.svg',
  'gcp-pub-sub': '/src/components/cloud-services/gcp/pub-sub.svg',
  'aws-ec2': '/src/components/cloud-services/aws/ec2.svg',
  'aws-s3': '/src/components/cloud-services/aws/s3.svg',
  'aws-lambda': '/src/components/cloud-services/aws/lambda.svg',
  'aws-rds': '/src/components/cloud-services/aws/rds.svg',
  'azure-vm': '/src/components/cloud-services/azure/vm.svg',
  'azure-blob-storage': '/src/components/cloud-services/azure/blob-storage.svg',
  'azure-functions': '/src/components/cloud-services/azure/functions.svg',
  'azure-sql-database': '/src/components/cloud-services/azure/sql-database.svg',
};

// Helper function to check if node type is a cloud service
const isCloudService = (nodeType: NodeType): boolean => {
  return nodeType in cloudServiceIcons;
};

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
  'gcp-cloud-run': {
    bg: 'bg-blue-100/20',
    border: 'border-blue-300/50',
    icon: 'text-blue-600'
  },
  'gcp-cloud-storage': {
    bg: 'bg-red-100/20',
    border: 'border-red-300/50',
    icon: 'text-red-600'
  },
  'gcp-bigquery': {
    bg: 'bg-blue-100/20',
    border: 'border-blue-300/50',
    icon: 'text-blue-600'
  },
  'gcp-pub-sub': {
    bg: 'bg-yellow-100/20',
    border: 'border-yellow-300/50',
    icon: 'text-yellow-600'
  },
  'aws-ec2': {
    bg: 'bg-orange-100/20',
    border: 'border-orange-300/50',
    icon: 'text-orange-600'
  },
  'aws-s3': {
    bg: 'bg-orange-100/20',
    border: 'border-orange-300/50',
    icon: 'text-orange-600'
  },
  'aws-lambda': {
    bg: 'bg-orange-100/20',
    border: 'border-orange-300/50',
    icon: 'text-orange-600'
  },
  'aws-rds': {
    bg: 'bg-orange-100/20',
    border: 'border-orange-300/50',
    icon: 'text-orange-600'
  },
  'azure-vm': {
    bg: 'bg-cyan-100/20',
    border: 'border-cyan-300/50',
    icon: 'text-cyan-600'
  },
  'azure-blob-storage': {
    bg: 'bg-cyan-100/20',
    border: 'border-cyan-300/50',
    icon: 'text-cyan-600'
  },
  'azure-functions': {
    bg: 'bg-cyan-100/20',
    border: 'border-cyan-300/50',
    icon: 'text-cyan-600'
  },
  'azure-sql-database': {
    bg: 'bg-cyan-100/20',
    border: 'border-cyan-300/50',
    icon: 'text-cyan-600'
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
  const isCloudServiceNode = isCloudService(data.nodeType);
  const [isHovered, setIsHovered] = useState(false);

  const getHandleStyle = (isSource: boolean = false) => ({
    background: isSource ? '#10b981' : '#3b82f6',
    width: 8,
    height: 8,
    opacity: selected || isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out'
  });

  if (isTextNode) {
    return (
      <div
        className="px-2 py-1 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Handle
          type="target"
          position={Position.Top}
          id="target-top"
          style={{
            ...getHandleStyle(false),
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
            ...getHandleStyle(false),
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
            ...getHandleStyle(false),
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
            ...getHandleStyle(false),
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
            ...getHandleStyle(true),
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
            ...getHandleStyle(true),
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
            ...getHandleStyle(true),
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
            ...getHandleStyle(true),
            left: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <span className="text-foreground font-medium text-sm">{data.label}</span>
      </div>
    );
  }

  // Cloud service nodes - display as icon with optional label
  if (isCloudServiceNode) {
    return (
      <div
        className="flex flex-col items-center relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Connection handles - only visible on hover/select */}
        <Handle
          type="target"
          position={Position.Top}
          id="target-top"
          style={{
            ...getHandleStyle(false),
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
            ...getHandleStyle(false),
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
            ...getHandleStyle(false),
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
            ...getHandleStyle(false),
            left: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />

        {/* Icon container */}
        <div className={cn(
          'p-2 rounded-lg transition-all duration-200',
          selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
        )}>
          <div className="w-12 h-12 flex-shrink-0">
            <img
              src={cloudServiceIcons[data.nodeType]}
              alt={data.label}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs font-medium" style={{ display: 'none' }}>
              {data.label.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Optional label */}
        {data.label && (
          <div className="mt-1 text-center">
            <span className="text-xs font-medium text-foreground leading-tight">
              {data.label}
            </span>
          </div>
        )}

        {/* Description */}
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 text-center max-w-[120px]">
            {data.description}
          </p>
        )}

        {/* Source handles - only visible on hover/select */}
        <Handle
          type="source"
          position={Position.Top}
          id="source-top"
          style={{
            ...getHandleStyle(true),
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
            ...getHandleStyle(true),
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
            ...getHandleStyle(true),
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
            ...getHandleStyle(true),
            left: -4,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        style={{
          ...getHandleStyle(false),
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
          ...getHandleStyle(false),
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
          ...getHandleStyle(false),
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
          ...getHandleStyle(false),
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
          ...getHandleStyle(true),
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
          ...getHandleStyle(true),
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
          ...getHandleStyle(true),
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
          ...getHandleStyle(true),
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
};

export default memo(BaseNode);
