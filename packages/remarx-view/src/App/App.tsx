import * as React from 'react';
import { DependencyGraph } from '../views/DependencyGraph';

interface IAppProps {}

export const App: React.FunctionComponent<IAppProps> = props => {
  return <DependencyGraph />;
};
