"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getBalanceSheetReportAPI } from "./BalanceSheetApis";

export const useBalanceSheet = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [asOnDate, setAsOnDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [ledgerLiablitiesTableData, setLedgerLiablitiesTableData] = useState(
    []
  );
  const [ledgerAssetsTableData, setLedgerAssetsTableData] = useState([]);

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
    getBalanceSheetReportApiCall(values);
    setAsOnDate(format(values.toDate, "dd-MM-yyyy"));
  };

  const groupDataByHeadId = (details) => {
    const grandTotals = {
      grandTotalAmount: 0,
    };

    const groupedData = details.reduce((acc, current) => {
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

  const getBalanceSheetReportApiCall = async (item) => {
    setLoading(true);

    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getBalanceSheetReportAPI(
        orgId,
        item.branch,
        postToDate
      );

      if (res.message === "Data Found") {
        const newAssetData = res.details.filter(
          (item) => item.Position === "A"
        );
        const newLiablitiesData = res.details.filter(
          (item) => item.Position === "L"
        );

        console.log(groupDataByHeadId(newAssetData));
        console.log(groupDataByHeadId(newLiablitiesData));

        setLedgerAssetsTableData(groupDataByHeadId(newAssetData));
        setLedgerLiablitiesTableData(groupDataByHeadId(newLiablitiesData));
      } else {
        setLedgerAssetsTableData([]);
        setLedgerLiablitiesTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLedgerAssetsTableData([]);
      setLedgerLiablitiesTableData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    ledgerAssetsTableData,
    ledgerLiablitiesTableData,
    asOnDate,
  };
};
