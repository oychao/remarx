enum Category {
  PlusType = 'Plus',
  MinusType = 'Minus',
  MultiplyType = 'Multiply',
  DivideType = 'Divide',
}

interface AbsNode {
  cate: Category;
  value: number;
  children: AbsNode[];
}

class ConcreteNode implements AbsNode {
  public cate: Category;
  public value: number;
  public children: ConcreteNode[];

  constructor(node: AbsNode) {
    this.cate = node.cate;
    this.value = node.value;
    this.children = (node.children || []).map(node => new ConcreteNode(node));
  }

  public accept(visitor: AbsVisitor, path: AbsNode[] = []): void {
    visitor.visit(this, path);
  }
}

abstract class AbsVisitor {
  public visit(element: ConcreteNode, path: AbsNode[] = []): void {
    path.push(element);
    if (this[`visit${element.cate}`]) {
      this[`visit${element.cate}`](element, path);
    }
    (element.children || []).forEach(node => {
      node.accept(this, path);
    });
    path.pop();
  }
}

interface NodePlusVisitable {
  visitPlus(element: ConcreteNode, path: AbsNode[]): void;
}
interface NodeMinusVisitable {
  visitMinus(element: ConcreteNode, path: AbsNode[]): void;
}
interface NodeMultiplyVisitable {
  visitMultiply(element: ConcreteNode, path: AbsNode[]): void;
}
interface NodeDivideVisitable {
  visitDivide(element: ConcreteNode, path: AbsNode[]): void;
}

class ConcreteVisitorFoo extends AbsVisitor
  implements NodePlusVisitable, NodeMinusVisitable, NodeMultiplyVisitable, NodeDivideVisitable {
  public visitPlus(element: ConcreteNode, path: AbsNode[]): void {
    console.log(
      `ConcreteVisitorFoo is visiting a Plus Node, of which value is ${element.value}. Current path: ${path
        .map(node => `${node.cate}-${node.value}`)
        .join(',')}`
    );
  }
  public visitMinus(element: ConcreteNode, path: AbsNode[]): void {
    console.log(
      `ConcreteVisitorFoo is visiting a Minus Node , of which value is ${element.value}. Current path: ${path
        .map(node => `${node.cate}-${node.value}`)
        .join(',')}`
    );
  }
  public visitMultiply(element: ConcreteNode, path: AbsNode[]): void {
    console.log(
      `ConcreteVisitorFoo is visiting a Multiply Node , of which value is ${element.value}. Current path: ${path
        .map(node => `${node.cate}-${node.value}`)
        .join(',')}`
    );
  }
  public visitDivide(element: ConcreteNode, path: AbsNode[]): void {
    console.log(
      `ConcreteVisitorFoo is visiting a Divide Node , of which value is ${element.value}. Current path: ${path
        .map(node => `${node.cate}-${node.value}`)
        .join(',')}`
    );
  }
}

class ConcreteVisitorBar extends AbsVisitor
  implements NodePlusVisitable, NodeMinusVisitable, NodeMultiplyVisitable, NodeDivideVisitable {
  public visitPlus(element: ConcreteNode, path: AbsNode[]): void {
    throw new Error('Method not implemented.');
  }
  public visitMinus(element: ConcreteNode, path: AbsNode[]): void {
    throw new Error('Method not implemented.');
  }
  public visitMultiply(element: ConcreteNode, path: AbsNode[]): void {
    throw new Error('Method not implemented.');
  }
  public visitDivide(element: ConcreteNode, path: AbsNode[]): void {
    throw new Error('Method not implemented.');
  }
}

const obj: AbsNode = {
  cate: Category.PlusType,
  value: 10,
  children: [
    {
      cate: Category.DivideType,
      value: 4,
      children: null,
    },
    {
      cate: Category.MinusType,
      value: 2,
      children: [
        {
          cate: Category.MultiplyType,
          value: 3,
          children: null,
        },
      ],
    },
  ],
};

function main(): void {
  const root = new ConcreteNode(obj);
  const foo = new ConcreteVisitorFoo();
  root.accept(foo);
}

main();
