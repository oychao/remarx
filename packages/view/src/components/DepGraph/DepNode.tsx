import * as React from 'react';

export const NODE_HALF_WIDTH = 60;
export const NODE_HALF_HEIGHT = 20;

export interface NodeStyle {
  rectFill: string;
  textFill: string;
}

interface DepNodeProps {
  node: dagre.Node;
  determineStyle?: (node: dagre.Node) => NodeStyle;
  onNodeClick?: (path: string) => void;
}

/**
 * dependency graph node
 */
export const DepNode = ({
  node,
  determineStyle = () => ({ rectFill: 'grey', textFill: 'orange' }),
  onNodeClick = () => null,
}: DepNodeProps) => {
  const { x, y, height, width, label } = node;
  const nodeStyle = determineStyle(node);

  const showName = React.useMemo(() => {
    const parts = label.split('/');
    const lastPart = parts.pop();
    if (lastPart.slice(0, 5) === 'index') {
      return `${parts.pop()}/${lastPart}`;
    } else {
      return lastPart;
    }
  }, [label]);

  const handleClick: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void = React.useCallback(() => {
    onNodeClick(label.split('#')[0]);
  }, [label]);

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} height={height} width={width} style={{ fill: nodeStyle.rectFill }} />
      <text x={x} y={y + NODE_HALF_HEIGHT * 2} style={{ fill: nodeStyle.textFill }}>
        {showName}
      </text>
    </g>
  );
};
