/// <reference types="react" />
import { NodeStyle } from './DepNode';
interface DepGraphProps {
    graphModel: GraphView;
    determineStyle?: (node: dagre.Node) => NodeStyle;
    onNodeClick?: (path: string) => void;
}
export declare function DepGraph({ graphModel, determineStyle, onNodeClick }: DepGraphProps): JSX.Element;
export {};
