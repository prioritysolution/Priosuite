"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getPlAppropiationReportAPI } from "./PlAppropiationApis";

export const usePlAppropiation = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [asOnDate, setAsOnDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [ledgerExpenditureTableData, setLedgerExpenditureTableData] = useState(
    []
  );
  const [ledgerIncomeTableData, setLedgerIncomeTableData] = useState([]);

  const formSchema = yup.object({
    toDate: yup.date().required("To date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      toDate: null,
      branch: branchId,
    },
  });

  const handleSubmit = (values) => {
    getPlAppropiationReportApiCall(values);
    setAsOnDate(format(values.toDate, "dd-MM-yyyy"));
  };

  const calculateTotal = (data, field) => {
    return (
      data &&
      data.reduce((total, item) => {
        const value = item[field];
        // Convert value to number, treating null or empty as 0
        const numericValue = value ? parseFloat(value) : 0;
        return total + numericValue;
      }, 0)
    );
  };

  const totalExpenditure = calculateTotal(
    ledgerExpenditureTableData.filter((data) => data.Id !== 5),
    "Amount"
  );
  const totalIncome = calculateTotal(ledgerIncomeTableData, "Amount");

  const getPlAppropiationReportApiCall = async (item) => {
    setLoading(true);

    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getPlAppropiationReportAPI(
        orgId,
        item.branch,
        postToDate
      );

      if (res.message === "Data Found") {
        const newExpenditureData = res.details.filter(
          (item) => item.Position === "L"
        );
        const newIncomeData = res.details.filter(
          (item) => item.Position === "R"
        );

        setLedgerExpenditureTableData(newExpenditureData);
        setLedgerIncomeTableData(newIncomeData);
      } else {
        setLedgerExpenditureTableData([]);
        setLedgerIncomeTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLedgerExpenditureTableData([]);
      setLedgerIncomeTableData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    ledgerExpenditureTableData,
    ledgerIncomeTableData,
    totalExpenditure,
    totalIncome,
    asOnDate,
  };
};
