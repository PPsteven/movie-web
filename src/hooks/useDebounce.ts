import { useEffect, useState } from "react";

// NOTE: debouncing 防抖
// Why this function can be used to debounce?
// useEffect will run in 2 scenarios: 1. component is mounting 2. dependencies changes
export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // NOTE: useEffect 中的副作用函数和清理函数
  // useEffect(A) A = ()=> {return B}
  // A: 副作用函数，当组件首次渲染时；当依赖项发生变化【后】
  // B: 清理函数，当组件unmount时; 当依赖项发生变化【前】
  // execute order:
  // 首先渲染：执行A
  // 当依赖变化：执行B，清理函数。在执行A。
  // unmount：执行B
  useEffect(() => {
    // NOTE: setTimeout
    // timerID = setTimeout(myFunction, 2000); // exec after 2s
    // timerID represents the timer that was set up by setTimeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
