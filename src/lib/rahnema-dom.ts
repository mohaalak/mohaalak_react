import { MElement } from "./rahnema";

type Instance = {
  prevDom: HTMLElement;
  prevElement: MElement;
  childInstances: Instance[];
};
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
  if (element.type === "TEXT ELEMENT") {
    const dom = document.createTextNode("");
    updateDomAttribute(dom as unknown as HTMLElement, element);
    return {
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
    return { prevDom: dom, childInstances: children, prevElement: element };
  }
}

const reconcile = (
  newElement: MElement | null,
  instance: Instance | null,
  parentDom: HTMLElement
) => {
  if (instance === null) {
    const instance = instantiate(newElement!);
    parentDom.append(instance.prevDom);
    return instance;
  } else if (newElement === null) {
    parentDom.removeChild(instance.prevDom);
    return null;
  } else if (newElement.type !== instance.prevElement.type) {
    const newInstance = instantiate(newElement);
    parentDom.replaceChild(newInstance.prevDom, instance.prevDom);
    return newInstance;
  } else {
    if (newElement?.type === "ul") {
      console.log(newElement, instance, parentDom);
    }
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
      prevElement: newElement,
      prevDom: instance.prevDom,
      childInstances: children.filter((x): x is Instance => x !== null),
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
