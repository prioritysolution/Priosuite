"use client";

import VoucherapprovaComponent from "@/components/approval/Voucherapprova";
import React from "react";
import { useVoucherapprova } from "./Hooks";

const VoucherapprovaContainer = () => {
  const hookData = useVoucherapprova();
  return <VoucherapprovaComponent {...hookData} />;
};

export default VoucherapprovaContainer;
