"use client";
import { store } from "./configureStore";
import { Provider } from "react-redux";

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
