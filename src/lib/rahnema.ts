import { ComponentInstance, Instance, reconcile } from "./rahnema-dom";

export type ComponentType = typeof Component;
export type DOMElement = {
  tag: "domElement";
  type: string;
  children: MElement[];
  props: Record<string, any>;
};
export type ClassElement = {
  tag: "classComponent";
  type: ComponentType;
  children: MElement[];
  props: Record<string, any>;
};
export type MElement = DOMElement | ClassElement;
export const createElement = (
  type: string | ComponentType,
  props?: Record<string, any>,
  ...children: Array<MElement | string>
): MElement => {
  return {
    ...(typeof type === "string"
      ? { tag: "domElement", type }
      : { tag: "classComponent", type }),
    props: props ?? {},
    children: (children ?? [])
      .flatMap((x) => (Array.isArray(x) ? x : [x]))
      .filter((x) => x !== undefined || x !== null)
      .map(
        (x): MElement =>
          typeof x === "string"
            ? {
                type: "TEXT ELEMENT",
                tag: "domElement",
                props: { nodeValue: x },
                children: [],
              }
            : x
      ),
  };
};

export class Component<Props, State> {
  props: Props;
  state!: State;
  context: any;
  forceUpdate: any;
  refs: any;

  __internalInstance: ComponentInstance;
  constructor(props: Props) {
    this.props = props;
  }
  setState(fn: (state: State) => State) {
    this.state = fn(this.state);
    const elem = this.render();
    const parentDom = this.__internalInstance.prevDom.parentElement!;
    this.__internalInstance = reconcile(
      elem,
      this.__internalInstance,
      parentDom
    )! as ComponentInstance;
  }

  render(): MElement {
    return { type: "div", tag: "domElement", props: {}, children: [] };
  }
}

export default { createElement, Component };
