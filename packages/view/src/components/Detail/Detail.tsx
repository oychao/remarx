import * as React from 'react';

interface DetailProps {
  node: dagre.Node;
}

export function Detail({ node }: DetailProps) {
  return (
    <div>
      <pre>{JSON.stringify(node?.detail, null, 2)}</pre>
    </div>
  );
}
