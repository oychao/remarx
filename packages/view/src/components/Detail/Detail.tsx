import * as React from 'react';

import { useStore } from '../../store/index';

interface DetailProps {}

export function Detail({}: DetailProps) {
  const { curNode } = useStore();
  return (
    <div>
      <pre>{JSON.stringify(curNode?.detail)}</pre>
    </div>
  );
}
