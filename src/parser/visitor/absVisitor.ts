import { ConcreteNode } from '../node/astNode';

export abstract class AbsVisitor {
  public visit(element: ConcreteNode, path: ConcreteNode[] = []): void {
    path.push(element);
    if ((this as any)[`visit${element.type}`]) {
      (this as any)[`visit${element.type}`](element, path);
    }
    for (const key in element) {
      if (element.hasOwnProperty(key)) {
        const value = (element as any)[key];
        if (value instanceof ConcreteNode) {
          value.accept(this, path);
        } else if (Array.isArray(value)) {
          value.forEach(subValue => {
            if (subValue instanceof ConcreteNode) {
              subValue.accept(this, path);
            }
          });
        }
      }
    }
    path.pop();
  }
}
