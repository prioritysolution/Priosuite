"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { getLoanGenerateScheduleAPI } from "./GenerateScheduleApis";
import { format } from "date-fns";

export const useGenerateSchedule = () => {
  const orgId = getCookieData("orgId");

  const [loading, setLoading] = useState("");

  const [date, setDate] = useState(null);

  const [personalData, setPersonalData] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleLoanAccountFormSubmit = (values) => {
    getLoanGenerateScheduleApiCall(orgId, values.accountNo);
    setDate(values.date);
  };

  const getLoanGenerateScheduleApiCall = async (orgId, acctNo) => {
    setLoading(true);
    try {
      const res = await getLoanGenerateScheduleAPI(orgId, acctNo);
      if (res.message === "Data Found") {
        setPersonalData(res.details?.personal_details || null);
        setTableData(res.details?.schedule_details || []);
      } else {
        setPersonalData(null);
        setTableData([]);
        toast.error(res.details || res.message);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setPersonalData(null);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLoanAccountFormSubmit,
    personalData,
    tableData,
    date,
  };
};
