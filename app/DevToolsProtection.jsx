"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DevToolsProtection = () => {
  const router = useRouter();

  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();

    const blockKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["I", "J", "C"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
        toast.error("DevTools access is disabled.");
      }
    };
    window.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", blockKeys);

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [router]);

  return null;
};

export default DevToolsProtection;
