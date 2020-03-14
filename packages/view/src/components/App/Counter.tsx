import * as React from 'react';
import { useState } from 'react';

export function Counter(): JSX.Element {
  const [count, setCount] = React.useState(0);
  const [count2] = useState(0);
  const [, setCount3] = useState(0);
  const countSet = useState(1);

  return (
    <div>
      <span>{count}</span>
      <span>{count2}</span>
    </div>
  );
}
