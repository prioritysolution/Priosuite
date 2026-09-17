"use client";

import InvestmentapprovalComponent from "@/components/approval/Investmentapproval";
import React from "react";
import { useInvestmentapproval } from "./Hooks";

const InvestmentapprovalContainer = () => {
  const hookData = useInvestmentapproval();

  return <InvestmentapprovalComponent {...hookData} />;
};

export default InvestmentapprovalContainer;
