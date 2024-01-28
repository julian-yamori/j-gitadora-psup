import { Dispatch, SetStateAction, useMemo, useState } from "react";

export type FilterItemState<V> = {
  enabled: boolean;
  value: V;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  setValue: Dispatch<SetStateAction<V>>;
};

export function useFilterItemState<V>(initialValue: V): FilterItemState<V> {
  const [value, setValue] = useState(initialValue);
  const [enabled, setEnabled] = useState(false);
  return useMemo(
    () => ({ enabled, value, setEnabled, setValue }),
    [value, enabled],
  );
}

type MinMaxNumberState = FilterItemState<[string, string]>;

type NumberInputChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
) => unknown;

export function minMaxNumberChangeHandler(
  state: MinMaxNumberState,
): [NumberInputChangeHandler, NumberInputChangeHandler] {
  return [
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      state.setValue((old) => [newValue, old[1]]);
    },
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      state.setValue((old) => [old[0], newValue]);
    },
  ];
}
