import { useEffect } from "react";

const usePreventNumberScroll = () => {
  useEffect(() => {
    const handleWheel = (event) => {
      if (event.target?.type === "number") {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event) => {
      if (
        event.target?.type === "number" &&
        ["ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

export default usePreventNumberScroll;
