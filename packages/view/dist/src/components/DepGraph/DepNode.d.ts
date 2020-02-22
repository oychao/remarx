/// <reference types="react" />
export declare const NODE_HALF_WIDTH = 60;
export declare const NODE_HALF_HEIGHT = 20;
export interface NodeStyle {
    rectFill: string;
    textFill: string;
}
interface DepNodeProps {
    node: dagre.Node;
    determineStyle?: (node: dagre.Node) => NodeStyle;
    onNodeClick?: (path: string) => void;
}
/**
 * dependency graph node
 */
export declare const DepNode: ({ node, determineStyle, onNodeClick, }: DepNodeProps) => JSX.Element;
export {};
