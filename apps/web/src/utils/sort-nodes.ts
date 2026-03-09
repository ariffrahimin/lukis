import { type Node } from '@xyflow/react';

/** Ensure parent sub flow nodes appear before their children in the array */
export const sortNodesForSubFlow = (nodes: Node[]): Node[] => {
  const sorted: Node[] = [];
  const childNodes: Node[] = [];

  for (const node of nodes) {
    if (node.parentId) {
      childNodes.push(node);
    } else {
      sorted.push(node);
    }
  }

  return [...sorted, ...childNodes];
};
