import { DOMElement, MElement, Component } from "./rahnema";

type DomInstance = {
  tag: "ElementInstance";
  prevDom: HTMLElement;
  prevElement: MElement;
  childInstances: Instance[];
};

export type ComponentInstance = {
  tag: "ComponentInstance";
  component: Component<any, any>;
  prevDom: HTMLElement;
  prevElement: MElement;
  childInstances: Instance[];
};
export type Instance = ComponentInstance | DomInstance;

function updateDomAttribute(
  dom: HTMLElement,
  newElement: MElement,
  prevElement?: MElement
) {
  if (prevElement) {
    Object.entries(prevElement.props).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        dom.removeEventListener(key.slice(2)?.toLowerCase() as string, value);
      } else {
        (dom as any)[key] = null;
      }
    });
  }
  Object.entries(newElement.props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      dom.addEventListener(key.slice(2)?.toLowerCase() as string, value);
    } else if (key === "style") {
      const styleToString = (style: any) => {
        return Object.keys(style).reduce(
          (acc, key) =>
            acc +
            key
              .split(/(?=[A-Z])/)
              .join("-")
              .toLowerCase() +
            ":" +
            style[key] +
            ";",
          ""
        );
      };
      (dom as any).style = styleToString(value);
    } else {
      (dom as any)[key] = value;
    }
  });
}
function instantiate(element: MElement): Instance {
  switch (element.tag) {
    case "domElement": {
      if (element.type === "TEXT ELEMENT") {
        const dom = document.createTextNode("");
        updateDomAttribute(dom as unknown as HTMLElement, element);
        return {
          tag: "ElementInstance",
          prevDom: dom as unknown as HTMLElement,
          prevElement: element,
          childInstances: [],
        };
      } else {
        const dom = document.createElement(element.type);
        if (element.props) {
          updateDomAttribute(dom, element);
        }
        const children = (element.children || []).map(instantiate);

        dom.append(...children.map((x) => x.prevDom));
        return {
          tag: "ElementInstance",
          prevDom: dom,
          childInstances: children,
          prevElement: element,
        };
      }
    }
    case "classComponent": {
      const component = new element.type(element.props);
      const elem = component.render();
      const inst = instantiate(elem);
      component.__internalInstance = {
        tag: "ComponentInstance",
        component,
        prevDom: inst.prevDom,
        prevElement: element,
        childInstances: [inst],
      };

      return {
        tag: "ComponentInstance",
        component: component,
        prevDom: inst.prevDom,
        prevElement: element,
        childInstances: [inst],
      };
    }
  }
}

export const reconcile = (
  newElement: MElement | null,
  instance: Instance | null,
  parentDom: HTMLElement
): Instance | null => {
  if (instance === null) {
    // create element
    const instance = instantiate(newElement!);
    parentDom.append(instance.prevDom);
    return instance;
  } else if (newElement === null) {
    // delete elemen
    parentDom.removeChild(instance.prevDom);
    return null;
  } else if (newElement.type !== instance.prevElement.type) {
    // replace
    const newInstance = instantiate(newElement);
    parentDom.replaceChild(newInstance.prevDom, instance.prevDom);
    return newInstance;
  } else if (typeof newElement.type === "string") {
    // update dom element
    updateDomAttribute(instance.prevDom, newElement, instance.prevElement);

    const len = Math.max(
      newElement.children.length,
      instance.childInstances.length
    );
    const children: Array<Instance | null> = [];
    for (let i = 0; i < len; i++) {
      const element = newElement.children[i];
      const prevInstance = instance.childInstances[i];

      children.push(
        reconcile(
          element === undefined ? null : element,
          prevInstance === undefined ? null : prevInstance,
          instance.prevDom
        )
      );
    }

    return {
      tag: "ElementInstance",
      prevElement: newElement,
      prevDom: instance.prevDom,
      childInstances: children.filter((x): x is Instance => x !== null),
    };
  } else if (
    newElement.tag === "classComponent" &&
    instance.tag === "ComponentInstance"
  ) {
    instance.component.props = newElement.props;
    const elem = instance.component.render();
    const newInstance = reconcile(
      elem,
      instance.childInstances[0]!,
      parentDom
    )!;

    return {
      tag: "ComponentInstance",
      component: instance.component,
      prevDom: newInstance!.prevDom,
      prevElement: newElement,
      childInstances: [newInstance],
    };
  }
  return instance;
};

let prevInstance: Instance | null = null;
const render = (container: MElement, root: HTMLElement | null) => {
  if (root === null) {
    throw new Error("You don't have a root div");
  }
  const instance = reconcile(container, prevInstance, root);
  prevInstance = instance === undefined ? null : instance;
};

export default {
  render,
};
