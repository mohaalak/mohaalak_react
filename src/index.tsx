import Rahnema, { MElement } from "./lib/rahnema";
import RahnemaDom from "./lib/rahnema-dom";
import 

interface TodoItem {
  value: string;
  done: boolean;
}

type State = ReadonlyArray<Readonly<TodoItem>>;

class InputContainer extends Rahnema.Component<
  {
    onSubmit: (input: string) => void;
    submitText: string;
  },
  { inputText: string }
> {
  state: { inputText: string } = { inputText: "" };
  render() {
    return (
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          this.props.onSubmit(this.state.inputText);
          this.setState((x) => ({ ...x, inputText: "" }));
        }}
      >
        <input
          value={this.state.inputText}
          onKeyPress={(event) => {
            this.setState((x) => ({ ...x, inputText: event.target.value }));
          }}
        />
        <button>{this.props.submitText}</button>
      </form>
    ) as any;
  }
}
class TodoApp extends Rahnema.Component<{}, State> {
  state: State = [];

  addTodo = (value: string) => {
    this.setState((state) => [...state, { value, done: false }]);
  };
  toggleTodo = (index: number) => {
    this.setState((state) =>
      state.map((x, i) => {
        if (i === index) {
          return { ...x, done: !x.done };
        }
        return x;
      })
    );
  };
  render() {
    return (
      <div>
        <InputContainer
          onSubmit={(x) => this.addTodo(x)}
          submitText={
            this.state.length === 0
              ? "Add your new Todo"
              : `Add Another Todo (${this.state.length})`
          }
        />
        {this.state.length === 0 ? (
          <h1> All thing done, damet garm!!!</h1>
        ) : (
          <ul>
            {this.state.map((x, i) => (
              <li
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
      </div>
    ) as unknown as MElement;
  }
}

// const init = (initialData: State) => {
//   let state: State = initialData;
//   const setState = (fn: (oldState: State) => State) => {
//     const newState = fn(state);
//     reload(newState);
//     state = newState;
//   };

//   reload(initialData);
//   return setState;
// };

// const setState = init([]);

RahnemaDom.render(
  //@ts-ignore
  <TodoApp></TodoApp>,
  document.getElementById("root")
);
