interface TodoItem {
  value: string;
  done: boolean;
}

type State = ReadonlyArray<Readonly<TodoItem>>;
const createElement = (
    type: string,
    props: Record<string, any>,
    ...children: Array<MElement | string>
  ): MElement => {
    return {
      type,
      props,
      children: children.map((x) =>
        typeof x === "string"
          ? { type: "TEXT ELEMENT", props: { nodeValue: x }, children: [] }
          : x
      ),
    };
  };
const init = (initialData: State) => {
  let state: State = initialData;
  const setState = (fn: (oldState: State) => State) => {
    const newState = fn(state);
    render(newState);
    state = newState;
  };

  render(initialData);
  return setState;
};

const setState = init([]);

const addTodo = (value: string) => {
  setState((state) => [...state, { value, done: false }]);
};
const toggleTodo = (index: number) => {
  setState((state) =>
    state.map((x, i) => {
      if (i === index) {
        return { ...x, done: !x.done };
      }
      return x;
    })
  );
};

type MElement = {
  type: string;
  children: MElement[];
  props: Record<string, any>;
};

function renderHTML(element: MElement) {
  if (element.type === "TEXT ELEMENT") {
    const dom = document.createTextNode("");
    Object.entries(element.props).forEach(([key, value]) => {
      (dom as any)[key] = value;
    });
    return dom;
  } else {
    const dom = document.createElement(element.type);
    Object.entries(element.props).forEach(([key, value]) => {
      if (key === "style") {
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
    const children = element.children.map(renderHTML);
    dom.append(...children);
    return dom;
  }
}


function render(state: State) {
  const root = document.getElementById("root");
  if (root === null) {
    throw new Error("You don't have a root div");
  }

  [...root.children].forEach((x) => root.removeChild(x));

  const object: MElement = createElement(
    "div",
    {},
    createElement(
      "form",
      {
        onsubmit: (event: any) => {
          event.preventDefault();
          addTodo(event.target[0].value);
        },
      },
      createElement("input", {}),
      createElement("button", {}, "Add Todo")
    ),

    createElement(
      "ul",
      {},
      ...state.map((x, index) =>
        createElement(
          "li",
          {
            onclick: () => toggleTodo(index),
            style: {
              textDecoration: x.done ? "line-through" : "none",
              cursor: "pointer",
            },
          },
          x.value
        )
      )
    )
  );

  const dom = renderHTML(object);

  root.appendChild(dom);
  //   const ul = document.createElement("ul");
  //   const inputContainer = document.createElement("div");
  //   const input = document.createElement("input");
  //   const button = document.createElement("button");
  //   button.append(document.createTextNode("Add Todo"));

  //   button.addEventListener("click", () => addTodo(input.value));

  //   input.addEventListener("keydown", (e) => {
  //     if (e.key === "Enter") {
  //       addTodo(input.value);
  //     }
  //   });

  //   const lis = state.map((x, index) => {
  //     const li = document.createElement("li");
  //     li.append(document.createTextNode(x.value));
  //     li.style.cursor = "pointer";
  //     li.style.textDecoration = x.done ? "line-through" : "";
  //     li.addEventListener("click", () => {
  //       toggleTodo(index);
  //     });
  //     return li;
  //   });
  //   ul.append(...lis);

  //   inputContainer.append(input);
  //   inputContainer.append(button);

  //   root.append(inputContainer);

  //   root.append(ul);
}
