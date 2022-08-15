import { useState, useEffect, useCallback } from "react";

export const useCounter = (init: number) => {
  const [count, setCount] = useState(init);
  // if (count === 0) {
  //   useEffect(() => {
  //     console.log("Hello");
  //   }, []);
  // } else {
  //   const kooft = useCallback(() => {
  //     console.log("hello from callback");
  //   }, []);
  //   kooft();
  // }
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);
  return { count, reset };
};
