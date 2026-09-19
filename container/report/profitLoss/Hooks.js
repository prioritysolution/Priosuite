"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProfitLossReportAPI } from "./ProfitLossApis";
import { parseLocalDate } from "@/utils/dateHelpers";

export const useProfitLoss = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const fromDate = useSelector((state) => state.footer.footerData.Start_Date);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [ledgerExpenditureTableData, setLedgerExpenditureTableData] = useState(
    []
  );
  const [ledgerIncomeTableData, setLedgerIncomeTableData] = useState([]);

  const [netData, setNetData] = useState([]);

  const defaultToDate = parseLocalDate(getCookieData("fin_end_date"));

  const formSchema = yup.object({
    toDate: yup.date().required("To date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      toDate: defaultToDate,
      branch: branchId,
    },
  });

  useEffect(() => {
    const finEndDate = parseLocalDate(getCookieData("fin_end_date"));
    if (finEndDate) {
      form.setValue("toDate", finEndDate, { shouldValidate: false });
    }
  }, [form]);

  const handleSubmit = (values) => {
    getProfitLossReportApiCall(values);
    setToDate(format(values.toDate, "dd-MM-yyyy"));
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

  const groupDataByHeadId = (details) => {
    const grandTotals = {
      grandTotalAmount: 0,
    };

    const groupedData = details
      .filter((data) => data.Head_Id !== null)
      .reduce((acc, current) => {
        // Parse numeric values for computation
        const amount = parseFloat(current.Amount) || 0;

        // Find if the Head_Id group already exists
        const groupIndex = acc.findIndex(
          (group) => group.headId === current.Head_Id
        );

        if (groupIndex !== -1) {
          // Update the existing group
          const group = acc[groupIndex];
          group.transactions.push(current);
          group.subtotalAmount += amount;
        } else {
          // Create a new group
          acc.push({
            headId: current.Head_Id,
            headName: current.Head_Name,
            transactions: [current],
            subtotalAmount: amount,
          });
        }

        // Update grand totals directly
        grandTotals.grandTotalAmount += amount;

        return acc;
      }, []);

    return { groupedData, grandTotals };
  };

  const getProfitLossReportApiCall = async (item) => {
    setLoading(true);

    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getProfitLossReportAPI(
        orgId,
        item.branch,
        fromDate,
        postToDate
      );

      if (res.message === "Data Found") {
        const newLeftData = res.details.filter((item) => item.Position === "L");
        const newRightData = res.details.filter(
          (item) => item.Position === "R"
        );

        setLedgerExpenditureTableData(groupDataByHeadId(newLeftData));
        setLedgerIncomeTableData(groupDataByHeadId(newRightData));

        console.log(groupDataByHeadId(newLeftData));
        console.log(groupDataByHeadId(newRightData));
        console.log(res.details.filter((data) => data.Head_Id === null));

        setNetData(res.details.filter((data) => data.Head_Id === null));
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
    netData,
    fromDate,
    toDate,
  };
};
