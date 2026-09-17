"use client";

import { useContext, createContext, useState } from "react";

// create context
const ModalContext = createContext();

// custom hooks to use modalcontext
export const useModalOpen = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <ModalContext.Provider value={{ modalOpen, handleOpen, handleClose }}>
      {children}
    </ModalContext.Provider>
  );
};
