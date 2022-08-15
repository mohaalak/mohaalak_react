import Rahnema from "react";
import RahnemaDom from "react-dom";
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

class Counter extends Rahnema.Component<{}, { counter: number }> {
  state = { counter: 0 };

  intervalId: number;
  componentDidMount() {
    this.intervalId = setInterval(() => {
      console.log("INterval anjam shod");
      this.setState((x) => ({ counter: x.counter + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  render() {
    return <h1>{this.state.counter}</h1>;
  }
}
class InputContainer extends Rahnema.Component<
  {
    onSubmit: (input: string) => void;
    submitText: string;
  },
  { inputText: string }
> {
  state: { inputText: string } = { inputText: "" };

  handleChange = (event: Rahnema.ChangeEvent<HTMLInputElement>) => {
    this.setState((x) => ({ ...x, inputText: event.target.value }));
  };
  render() {
    return (
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          this.props.onSubmit(this.state.inputText);
          this.setState((x) => ({ ...x, inputText: "" }));
        }}
      >
        <input value={this.state.inputText} onChange={this.handleChange} />
        <button>{this.props.submitText}</button>
      </form>
    ) as any;
  }
}
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

class TodoApp extends Rahnema.Component<{}, State> {
  state: State = { todos: [], filter: "Todo" };

  addTodo = (value: string) => {
    this.setState((state) => ({
      ...state,
      todos: [...state.todos, { value, done: false }],
    }));
  };
  toggleTodo = (index: number) => {
    this.setState((state) => ({
      ...state,
      todos: state.todos.map((x, i) => {
        if (i === index) {
          return { ...x, done: !x.done };
        }
        return x;
      }),
    }));
  };

  setFilter = (filter: Filter) => this.setState((x) => ({ ...x, filter }));

  render() {
    return (
      <div>
        <InputContainer
          onSubmit={(x) => this.addTodo(x)}
          submitText={
            this.state.todos.length === 0
              ? "Add your new Todo"
              : `Add Another Todo (${this.state.todos.length})`
          }
        />
        {this.state.todos.length === 0 ? (
          <DametGarm></DametGarm>
        ) : (
          <ul>
            {this.state.todos
              .filter((x): boolean => {
                switch (this.state.filter) {
                  case "Todo":
                    return !x.done;
                  case "Done":
                    return x.done;
                  case "All":
                    return true;
                }
              })
              .map((x, i) => (
                <li
                  key={i}
                  onClick={() => this.toggleTodo(i)}
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
              selectedFilter={this.state.filter}
              filter={x}
              setFilter={this.setFilter}
            />
          ))}
        </div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}
RahnemaDom.render(<TodoApp></TodoApp>, document.getElementById("root"));
