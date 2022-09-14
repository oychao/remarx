import * as React from 'react';
import type { FileRule } from 'remarx';
import { createContainer } from 'unstated-next';
import { useModuleGraph } from '../../services';
import { parseRegExp } from '../../utils';
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

    const nodeMap: Record<string, boolean> = {};

    const fileRules = (moduleGraphReqModel.data?.config?.fileRules ||
      []) as Array<FileRule>;

    fileRules.forEach(rule => {
      if ('string' === typeof rule.nameMatch) {
        rule.nameMatch = parseRegExp(rule.nameMatch as string);
      }
      result.cates.push({ name: rule.fileType as string });
    });

    let minSymbolSize = 20;
    let maxSymbolSize = 1;

    (moduleGraphReqModel.data?.depData || []).forEach((fileDep: FileDep) => {
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
      minSymbolSize = Math.min(symbolSize, minSymbolSize);
      maxSymbolSize = Math.max(symbolSize, maxSymbolSize);

      let category: string = fileRules.find(
        (rule: FileRule) => !rule.nameMatch
      )!.fileType as string;
      for (const rule of fileRules) {
        if (
          rule.nameMatch &&
          rule.nameMatch instanceof RegExp &&
          rule.nameMatch.test(fileDep.filePath)
        ) {
          category = rule.fileType as string;
          break;
        }
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

    result.nodes.forEach(node => {
      if (minSymbolSize === maxSymbolSize) {
        node.symbolSize = 20;
      } else {
        node.symbolSize *= 20 / (maxSymbolSize - minSymbolSize);
      }
    });

    (moduleGraphReqModel.data?.depData || []).forEach((fileDep: FileDep) => {
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
