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
      cates: [{ name: 'hook' }, { name: 'store' }, { name: 'else' }],
    };

    const nodeMap: Record<string, boolean> = {};

    (moduleGraphReqModel.data || []).forEach((fileDep: FileDep) => {
      if (
        nodeMap[fileDep.filePath] ||
        (!fileDep.filePath.endsWith('.ts') &&
          !fileDep.filePath.endsWith('.tsx') &&
          !fileDep.filePath.endsWith('.js'))
      ) {
        return;
      }

      const nameParts = fileDep.filePath.split('/');
      const name = nameParts[nameParts.length - 1].startsWith('index.')
        ? nameParts.slice(-2).join(' / ')
        : nameParts[nameParts.length - 1];

      const symbolSize =
        fileDep.depPaths.length + 1 > 20 ? 20 : fileDep.depPaths.length + 1;

      let category: string = 'else';
      if (fileDep.filePath.includes('Store')) {
        category = 'store';
      }
      if (name.startsWith('use')) {
        category = 'hook';
      }

      result.nodes.push({
        id: fileDep.filePath,
        name,
        symbolSize,
        x: 0,
        y: 0,
        value: fileDep.depPaths.length,
        category,
        label: {
          show: symbolSize > 10,
        },
      });
      nodeMap[fileDep.filePath] = true;
    });
    (moduleGraphReqModel.data || []).forEach((fileDep: FileDep) => {
      if (!nodeMap[fileDep.filePath]) {
        return;
      }
      fileDep.depPaths.forEach(dep => {
        if (!nodeMap[dep] || fileDep.filePath === dep) {
          return;
        }
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
