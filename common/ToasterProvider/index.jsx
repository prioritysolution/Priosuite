"use client";

import { Toaster } from "react-hot-toast";
const ToasterProvider = ({ children }) => {
  return (
    <>
      <Toaster position={"top-right"} reverseOrder={false} containerStyle={{ zIndex: 99999999 }} />
      {children}
    </>
  );
};

export default ToasterProvider;
