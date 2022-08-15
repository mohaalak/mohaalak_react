const memoize = (fn) => {
  const cache = {};
  return (...arg) => {
    console.log("ARG", arg);
    console.log("CACHE", cache);
    const key = JSON.stringify(arg);
    console.log("KEY", key);
    if (cache[key]) {
      return cache[key];
    }
    const result = fn(...arg);
    cache[key] = result;
    return result;
  };
};

const add = (x, y) => {
  console.log("Function Executed");
  return x + y;
};

const memoizedAdd = memoize(add);

memoizedAdd(2, 3, 5, 6, "Maraz", []);
memoizedAdd(2, 3, 5, 6, "Maraz", []);
