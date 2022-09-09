import * as React from 'react';
import { createContainer } from 'unstated-next';
import { useModuleGraph } from '../../services';
import {
  FileDep,
  Graph,
} from './DependencyGraphNetwork/DependencyGraphNetwork.type';

function useDependencyGraphModel(initialState = 0) {
  const moduleGraphReqModel = useModuleGraph();

  const graphModule = React.useMemo(() => {
    const result: Graph = {
      nodes: [],
      edges: [],
      cates: [],
    };

    (moduleGraphReqModel.data || []).forEach((fileDep: FileDep) => {
      result.nodes.push({
        id: fileDep.filePath,
        name: fileDep.filePath.split('/').pop() as string,
        symbolSize: (fileDep.depPaths.length + 1) * 10,
        x: 0,
        y: 0,
        value: fileDep.depPaths.length + 1,
        // category?: number;
        label: {
          show: true,
        },
      });

      fileDep.depPaths.forEach(dep => {
        result.edges.push({
          source: fileDep.filePath,
          target: dep,
        });
      });
    });

    return result;
  }, [moduleGraphReqModel.data]);

  return { moduleGraphReqModel, graphModule };
}

export const DependencyGraphModel = createContainer(useDependencyGraphModel);
