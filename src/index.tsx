import Rahnema, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RahnemaDom from "react-dom";
import { useCounter } from "./counter";
import "./index.css";

interface TodoItem {
  value: string;
  done: boolean;
}

const filterArray = ["All", "Todo", "Done"] as const;

type ReadonlyInfer<A extends ReadonlyArray<any>> = A extends ReadonlyArray<
  infer K
>
  ? K
  : never;

type FilterArray = typeof filterArray;

type Filter_ = FilterArray extends ReadonlyArray<infer x> ? x : never;

type Filter = typeof filterArray[number];
type State = {
  todos: ReadonlyArray<Readonly<TodoItem>>;
  filter: Filter;
};

const Counter = () => {
  const { count } = useCounter(0);

  return <h1>{count}</h1>;
};
const InputContainer = ({
  onSubmit,
  submitText,
}: {
  onSubmit: (input: string) => void;
  submitText: string;
}) => {
  const [state, setState] = useState({ inputText: "" });
  const input = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: Rahnema.ChangeEvent<HTMLInputElement>) => {
    setState((x) => ({ ...x, inputText: event.target.value }));
  };

  return (
    <form
      onSubmit={(event: any) => {
        event.preventDefault();
        onSubmit(state.inputText);
        input.current?.focus();
        setState((x) => ({ ...x, inputText: "" }));
      }}
    >
      <input value={state.inputText} onChange={handleChange} ref={input} />
      <button>{submitText}</button>
    </form>
  );
};
interface FilterInputProps {
  filter: Filter;
  selectedFilter: Filter;
  setFilter: (filter: Filter) => void;
}

const FilterInput = ({
  filter,
  selectedFilter,
  setFilter,
}: FilterInputProps) => {
  return (
    <button
      onClick={() => setFilter(filter)}
      className={selectedFilter === filter ? "selected" : ""}
    >
      {filter}
    </button>
  );
};

const DametGarm = () => (
  <div>
    <h1 className="hadi"> All thing done, damet garm!!!</h1>
    alaki dore khodet nagard <Counter></Counter> sanie hast ke task naneveshti
  </div>
);

const TodoApp = () => {
  const [todos, setTodos] = useState<Array<TodoItem>>([
    { value: "Get Milk", done: false },
    { value: "Get Kooft", done: false },
    { value: "Get Dard", done: true },
  ]);
  const [filter, setF] = useState<Filter>("All");

  const setFilter = (filter: Filter) => {
    setF(filter);
  };
  const selectedTodos = useMemo(() => {
    return todos.filter((x): boolean => {
      switch (filter) {
        case "Todo":
          return !x.done;
        case "Done":
          return x.done;
        case "All":
          return true;
      }
    });
  }, [todos, filter]);

  const addTodo = useCallback((value: string) => {
    setTodos((kooft) => [...kooft, { value, done: false }]);
  }, []);

  const toggleTodo = useCallback((index: number) => {
    setTodos((todos) =>
      todos.map((x, i) => {
        if (i === index) {
          return { ...x, done: !x.done };
        }
        return x;
      })
    );
  }, []);

  return (
    <div>
      <InputContainer
        onSubmit={addTodo}
        submitText={
          todos.length === 0
            ? "Add your new Todo"
            : `Add Another Todo (${todos.length})`
        }
      />
      {todos.length === 0 ? (
        <DametGarm></DametGarm>
      ) : (
        <ul>
          {selectedTodos.map((x, i) => (
            <li
              key={i}
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
      <div>
        {filterArray.map((x) => (
          <FilterInput
            key={x}
            selectedFilter={filter}
            filter={x}
            setFilter={setFilter}
          />
        ))}
      </div>
      <pre>{JSON.stringify({ todos, filter }, null, 2)}</pre>
    </div>
  );
};
console.log(<TodoApp></TodoApp>);
TodoApp.prototype = { hooks: [] };
TodoApp.prototype.hooks[0] = { value: 0, setState: () => {} };
RahnemaDom.render(<TodoApp></TodoApp>, document.getElementById("root"));
