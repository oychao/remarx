import * as React from 'react';

export const NODE_HALF_WIDTH = 150 as const;
export const NODE_HALF_HEIGHT = 10 as const;

interface DepNodeProps {
  node: DepNodeModel;
}

/**
 * dependency graph node
 */
export const DepNode = ({ node }: DepNodeProps) => {
  const { x, y, height, width, label } = node;
  return (
    <g>
      <rect x={x} y={y} height={height} width={width} style={{ fill: 'grey' }} />
      <text x={x} y={y + NODE_HALF_HEIGHT * 2} style={{ fill: 'orange' }}>
        {label}
      </text>
    </g>
  );
};
