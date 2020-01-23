import { ConcreteNode } from '../node/astNode';

export abstract class AbsVisitor {
  public async visit(element: ConcreteNode, path: ConcreteNode[] = []): Promise<void> {
    path.push(element);
    if ((this as any)[`visit${element.type}`]) {
      await (this as any)[`visit${element.type}`](element, path);
    }
    for (const key in element) {
      if (element.hasOwnProperty(key)) {
        const value = (element as any)[key];
        if (value instanceof ConcreteNode) {
          await value.accept(this, path);
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const subValue = value[i];
            if (subValue instanceof ConcreteNode) {
              await subValue.accept(this, path);
            }
          }
        }
      }
    }
    path.pop();
  }
}
