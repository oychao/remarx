import { createContainer } from 'unstated-next';
import { useModuleGraph } from '../../services';

function useDependencyGraphModel(initialState = 0) {
  const moduleGraphReqModel = useModuleGraph();
  return { moduleGraphReqModel };
}

export const DependencyGraphModel = createContainer(useDependencyGraphModel);
