"use client";

import GenerateSchedule from "@/components/loan/generateSchedule";
import { useGenerateSchedule } from "./Hooks";

const GenerateScheduleContainer = () => {
  const {
    loading,
    handleLoanAccountFormSubmit,
    personalData,
    tableData,
    date,
  } = useGenerateSchedule();

  return (
    <GenerateSchedule
      loading={loading}
      handleLoanAccountFormSubmit={handleLoanAccountFormSubmit}
      personalData={personalData}
      tableData={tableData}
      date={date}
    />
  );
};
export default GenerateScheduleContainer;
