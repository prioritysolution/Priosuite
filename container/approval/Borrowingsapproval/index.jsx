"use client";

import BorrowingsapprovalComponent from "@/components/approval/Borrowingsapproval";
import React from "react";
import { useBorrowingsapproval } from "./Hooks";

const BorrowingsapprovalContainer = () => {
  const hookData = useBorrowingsapproval();

  return <BorrowingsapprovalComponent {...hookData} />;
};

export default BorrowingsapprovalContainer;
