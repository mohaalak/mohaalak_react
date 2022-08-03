import { MElement } from "./rahnema";

function renderHTML(element: MElement) {
  if (element.type === "TEXT ELEMENT") {
    const dom = document.createTextNode("");
    Object.entries(element.props).forEach(([key, value]) => {
      (dom as any)[key] = value;
    });
    return dom;
  } else {
    const dom = document.createElement(element.type);
    if (element.props) {
      Object.entries(element.props).forEach(([key, value]) => {
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
    if (element.children) {
      const children = element.children.map(renderHTML);
      dom.append(...children);
    }
    return dom;
  }
}
const render = (container: MElement, root: HTMLElement | null) => {
  if (root === null) {
    throw new Error("You don't have a root div");
  }

  [...root.children].forEach((x) => root.removeChild(x));
  const dom = renderHTML(container);

  root.appendChild(dom);
};

export default {
  render,
};
