import { isNil } from 'lodash-es';
import { InvalidRootNodeException } from '../exceptions';

export class RootNode {
  readonly #value: Element | null;

  constructor(node: Element | Document | null | undefined) {
    this.#value = RootNode.validate(node);
  }

  public get value(): Element | null {
    return this.#value;
  }

  private static validate(node: unknown): Element | null {
    if (isNil(node)) {
      return null;
    }

    if (node instanceof Element && node.nodeType === Node.ELEMENT_NODE) {
      return node;
    }

    throw new InvalidRootNodeException();
  }
}
