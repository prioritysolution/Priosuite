"use client";

import LoanapproalComponent from "@/components/approval/Loanapproal";
import React from "react";
import { useLoanapproal } from "./Hooks";

const LoanapproalContainer = () => {
  const approvalProps = useLoanapproal();

  return <LoanapproalComponent {...approvalProps} />;
};

export default LoanapproalContainer;
