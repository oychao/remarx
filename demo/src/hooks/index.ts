import * as React from 'react';

export function useToggle(init: boolean = true): [boolean, () => void, () => void] {
  const [value, setValue] = React.useState(init);
  const setTrue = React.useCallback(() => setValue(true), []);
  const setFalse = React.useCallback(() => setValue(false), []);
  return [value, setTrue, setFalse];
}
