import React, { useCallback, useEffect, useState } from "react";

type Options<T> = {
  restore?: boolean;
  restoreAsyncCb?: () => Promise<T>;
};
export default function useStoreState<Type>(
  defaultState: Type,
  name: string,
  { restore = true, restoreAsyncCb }: Options<Type> = {}
) {
  const [state, setState] = useState<Type>(defaultState);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (first) return;
    localStorage.setItem(
      name,
      typeof state !== "string" ? JSON.stringify(state) : state
    );
  }, [state]);
  useEffect(() => {
    if (restore) {
      restoreOrAddAsync();
    }
    setFirst(false);
  }, []);
  const restoreOrAddAsync = useCallback(async () => {
    if (!restore) return;
    const fromLocalStorage = localStorage.getItem(name) as string;

    if (!fromLocalStorage) {
      if (restoreAsyncCb) {
        setState(await restoreAsyncCb());
      }
      return;
    }
    let parsedState: Type;
    if (typeof state !== "string") {
      parsedState = JSON.parse(fromLocalStorage);
    } else {
      parsedState = fromLocalStorage as unknown as Type;
    }
    setState(parsedState);
  }, []);
  return [state, setState] as const;
}
