import * as React from 'react';
import { NODE_HALF_HEIGHT, NODE_HALF_WIDTH } from './DepNode';

interface DepEdgeProps {
  edge: DepEdgeModel;
}

/**
 * dependency graph edge
 */
export const DepEdge = ({ edge }: DepEdgeProps) => {
  const { points } = edge;
  let d: string = `M ${points[0].x + NODE_HALF_WIDTH} ${points[0].y + NODE_HALF_HEIGHT}`;
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    d += ` L ${point.x + NODE_HALF_WIDTH} ${point.y + NODE_HALF_HEIGHT}`;
  }
  return <path fill='none' stroke='red' d={d} />;
};
