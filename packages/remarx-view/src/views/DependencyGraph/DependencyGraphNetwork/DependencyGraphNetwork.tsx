import * as React from 'react';
import { DependencyGraphModel } from '../DependencyGraph.model';

interface IDependencyGraphNetworkProps {}

export const DependencyGraphNetwork: React.FunctionComponent<
  IDependencyGraphNetworkProps
> = props => {
  const { moduleGraphReqModel } = DependencyGraphModel.useContainer();
  return <pre>{JSON.stringify(moduleGraphReqModel.data, null, 2)}</pre>;
};
