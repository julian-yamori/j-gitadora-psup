"use client";

import { CircularProgress } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type LoadingScreenState = Promise<unknown>[];

const stateContext = createContext<LoadingScreenState | undefined>(undefined);
const setStateContext = createContext<
  Dispatch<SetStateAction<LoadingScreenState>> | undefined
>(undefined);

/**
 * LoadingScreen に Promise を登録する関数のカスタムフック
 *
 * 関数に渡された Promise が終了するまでの間、 LoadingScreen を表示する
 */
export function useShowLoadingScreen(): (promise: Promise<unknown>) => void {
  const setState = useContext(setStateContext);
  if (!setState) {
    throw Error("LoadingScreen context is not provided");
  }

  return useCallback(
    (promise: Promise<unknown>) => {
      // state に Promise を追加
      setState((old) => [...old, promise]);

      /// Promise が終わったら state から削除する
      void promise.finally(() =>
        setState((old) => old.filter((p) => p !== promise)),
      );
    },
    [setState],
  );
}

/** LoadingScreen の Context Provider */
export function LoadingScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<LoadingScreenState>([]);

  return (
    <stateContext.Provider value={state}>
      <setStateContext.Provider value={setState}>
        {children}
      </setStateContext.Provider>
    </stateContext.Provider>
  );
}

/**
 * Promise の処理待ち画面
 *
 * 画面上の操作を抑制し、ローディング表記する
 */
export function LoadingScreen() {
  const state = useContext(stateContext);
  if (!state) {
    throw Error("LoadingScreen context is not provided");
  }

  // 待機中の Promise が無ければ表示しない
  if (state.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "rgb(255 255 255 / .2)",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1200,
      }}
    >
      <CircularProgress
        sx={{
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          left: "50%",
          position: "absolute",
        }}
      />
    </div>
  );
}
