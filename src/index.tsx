//** @jsx createElement */
interface TodoItem {
  value: string;
  done: boolean;
}

type State = ReadonlyArray<Readonly<TodoItem>>;
const createElement = (
  type: string,
  props?: Record<string, any>,
  ...children: Array<MElement | string>
): MElement => {
  return {
    type,
    props: props ?? {},
    children: children
      .flatMap((x) => (Array.isArray(x) ? x : [x]))
      .map((x) =>
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

function render(state: State) {
  const root = document.getElementById("root");
  if (root === null) {
    throw new Error("You don't have a root div");
  }

  [...root.children].forEach((x) => root.removeChild(x));

  console.log(state);
  const object: MElement = (
    <div>
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          addTodo(event.target[0].value);
        }}
      >
        <input></input>
        <button>Add Todo</button>
      </form>

      <ul>
        {state.map((x) => (
          <li
            style={{
              textDecoration: x.done ? "line-through" : "none",
              cursor: "pointer",
            }}
          >
            {x.value}
          </li>
        ))}
      </ul>
    </div>
  ) as unknown as MElement;

  console.log(object);
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
