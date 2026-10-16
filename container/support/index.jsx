"use client";

import Support from "@/components/support";
import { useSupport } from "./Hooks";

const SupportContainer = () => {
  const support = useSupport();
  return <Support {...support} />;
};

export default SupportContainer;
