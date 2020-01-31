import * as React from 'react';

import { data } from 'store/index';

import './style.less';

const NODE_HALF_WIDTH = 25 as const;

export function App() {
  return (
    <div className='app'>
      <svg style={{ height: '100%', width: '100%' }}>
        {data.default.nodes.map(({ label, height, width, x, y }) => (
          <g key={label}>
            <rect x={x} y={y} height={height} width={width} style={{ fill: 'yellowgreen' }} />
            <text x={x} y={y}>
              {label}
            </text>
          </g>
        ))}
        {data.default.edges.map(({ points }, idx) => {
          let d: string = `M ${points[0].x + NODE_HALF_WIDTH} ${points[0].y + NODE_HALF_WIDTH}`;
          for (let i = 1; i < points.length; i++) {
            const point = points[i];
            d += ` L ${point.x + NODE_HALF_WIDTH} ${point.y + NODE_HALF_WIDTH}`;
          }
          return <path fill='none' stroke='red' key={idx} d={d} />;
        })}
      </svg>
      {/* {JSON.stringify(data, null, 2)} */}
    </div>
  );
}
