import * as React from 'react';

import { useTest } from './test';

export function useToggle(init: boolean = true): [boolean, () => void, () => void] {
  const [value, setValue] = React.useState(init);
  const setTrue = React.useCallback(() => setValue(true), []);
  const setFalse = React.useCallback(() => setValue(false), []);
  useTest('');
  return [value, setTrue, setFalse];
}
