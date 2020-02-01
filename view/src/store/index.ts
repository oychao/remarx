import * as dataJson from './data.json';

export type DepGraphModel = {
  nodes: { label: string; width: number; height: number; x: number; y: number }[];
  edges: { points: { x: number; y: number }[] }[];
};

export const data = (dataJson as unknown) as { default: typeof dataJson };
