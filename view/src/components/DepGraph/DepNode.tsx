import * as React from 'react';

export const NODE_HALF_WIDTH = 150 as const;
export const NODE_HALF_HEIGHT = 10 as const;

export interface NodeStyle {
  rectFill: string;
  textFill: string;
}

interface DepNodeProps {
  node: DepNodeModel;
  determineStyle?: (node: DepNodeModel) => NodeStyle;
}

/**
 * dependency graph node
 */
export const DepNode = ({ node, determineStyle = () => ({ rectFill: 'grey', textFill: 'orange' }) }: DepNodeProps) => {
  const { x, y, height, width, label } = node;
  const nodeStyle = determineStyle(node);
  return (
    <g>
      <rect x={x} y={y} height={height} width={width} style={{ fill: nodeStyle.rectFill }} />
      <text x={x} y={y + NODE_HALF_HEIGHT * 2} style={{ fill: nodeStyle.textFill }}>
        {label}
      </text>
    </g>
  );
};
