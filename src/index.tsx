import Rahnema, { MElement } from "./lib/rahnema";
import RahnemaDom from "./lib/rahnema-dom";

interface TodoItem {
  value: string;
  done: boolean;
}

type State = ReadonlyArray<Readonly<TodoItem>>;

const init = (initialData: State) => {
  let state: State = initialData;
  const setState = (fn: (oldState: State) => State) => {
    const newState = fn(state);
    reload(newState);
    state = newState;
  };

  reload(initialData);
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
function reload(state: State) {
  RahnemaDom.render(
    (
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

        {state.length === 0 ? (
          <h1> All thing done, damet garm!!!</h1>
        ) : (
          <ul>
            {state.map((x, i) => (
              <li
                onClick={() => toggleTodo(i)}
                style={{
                  textDecoration: x.done ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {x.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    ) as unknown as MElement,
    document.getElementById("root")
  );
}
