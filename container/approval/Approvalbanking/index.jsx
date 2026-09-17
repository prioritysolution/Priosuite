"use client";

import ApprovalbankingComponents from "@/components/approval/Approvalbanking";
import React, { useEffect } from "react";
import { useApprovalbanking } from "./Hooks";

const ApprovalbankingContainer = () => {
  const hookData = useApprovalbanking();

  return <ApprovalbankingComponents {...hookData} />;
};

export default ApprovalbankingContainer;
