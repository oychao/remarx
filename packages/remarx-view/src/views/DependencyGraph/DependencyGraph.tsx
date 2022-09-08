import * as React from 'react';
import { DependencyGraphModel } from './DependencyGraph.model';
import { DependencyGraphNetwork } from './DependencyGraphNetwork';

interface IDependencyGraphProps {}

export const DependencyGraph: React.FunctionComponent<
  IDependencyGraphProps
> = props => {
  return (
    <DependencyGraphModel.Provider>
      <DependencyGraphNetwork />
    </DependencyGraphModel.Provider>
  );
};
