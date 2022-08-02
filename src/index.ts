interface TodoItem {
  value: string;
  done: boolean;
}

type State = ReadonlyArray<Readonly<TodoItem>>;

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

function render(state: State) {
  const root = document.getElementById("root");
  if (root === null) {
    throw new Error("You don't have a root div");
  }

  [...root.children].forEach((x) => root.removeChild(x));

  const ul = document.createElement("ul");
  const inputContainer = document.createElement("div");
  const input = document.createElement("input");
  const button = document.createElement("button");
  button.append(document.createTextNode("Add Todo"));

  button.addEventListener("click", () => addTodo(input.value));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTodo(input.value);
    }
  });

  const lis = state.map((x, index) => {
    const li = document.createElement("li");
    li.append(document.createTextNode(x.value));
    li.style.cursor = "pointer";
    li.style.textDecoration = x.done ? "line-through" : "";
    li.addEventListener("click", () => {
      toggleTodo(index);
    });
    return li;
  });
  ul.append(...lis);

  inputContainer.append(input);
  inputContainer.append(button);

  root.append(inputContainer);

  root.append(ul);
}
