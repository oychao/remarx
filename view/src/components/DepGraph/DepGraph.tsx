import * as React from 'react';

import { DepGraphModel } from 'store/index';

const NODE_HALF_WIDTH = 150 as const;
const NODE_HALF_HEIGHT = 10 as const;

export function DepGraph({ graphModel }: { graphModel: DepGraphModel }) {
  return (
    <svg style={{ height: '50%', width: '100%' }}>
      {graphModel.nodes.map(({ label, height, width, x, y }) => (
        <g key={label}>
          <rect x={x} y={y} height={height} width={width} style={{ fill: 'grey' }} />
          <text x={x} y={y + NODE_HALF_HEIGHT * 2} style={{ fill: 'orange' }}>
            {label}
          </text>
        </g>
      ))}
      {graphModel.edges.map(({ points }, idx) => {
        let d: string = `M ${points[0].x + NODE_HALF_WIDTH} ${points[0].y + NODE_HALF_HEIGHT}`;
        for (let i = 1; i < points.length; i++) {
          const point = points[i];
          d += ` L ${point.x + NODE_HALF_WIDTH} ${point.y + NODE_HALF_HEIGHT}`;
        }
        return <path fill='none' stroke='red' key={idx} d={d} />;
      })}
    </svg>
  );
}
