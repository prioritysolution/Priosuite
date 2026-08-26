"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getTrailBalanceReportAPI } from "./TrailBalanceApis";

export const useTrailBalance = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [ledgerLiablitiesTableData, setLedgerLiablitiesTableData] = useState(
    []
  );
  const [ledgerAssetsTableData, setLedgerAssetsTableData] = useState([]);

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      formDate: null,
      toDate: null,
      branch: branchId,
    },
  });

  const handleSubmit = (values) => {
    getTrailBalanceReportApiCall(values);
    setFromDate(format(values.fromDate, "dd-MM-yyyy"));
    setToDate(format(values.toDate, "dd-MM-yyyy"));
  };

  const groupDataByHeadId = (details) => {
    const grandTotals = {
      grandTotalOpening: 0,
      grandTotalDebit: 0,
      grandTotalCredit: 0,
      grandTotalClosing: 0,
    };

    const groupedData = details.reduce((acc, current) => {
      // Parse numeric values for computation
      const opening = parseFloat(current.Opening) || 0;
      const debit = parseFloat(current.Debit) || 0;
      const credit = parseFloat(current.Credit) || 0;
      const closing = parseFloat(current.Closing) || 0;

      // Find if the Head_Id group already exists
      const groupIndex = acc.findIndex(
        (group) => group.headId === current.Head_Id
      );

      if (groupIndex !== -1) {
        // Update the existing group
        const group = acc[groupIndex];
        group.transactions.push(current);
        group.subtotalOpening += opening;
        group.subtotalDebit += debit;
        group.subtotalCredit += credit;
        group.subtotalClosing += closing;
      } else {
        // Create a new group
        acc.push({
          headId: current.Head_Id,
          headName: current.Head_Name,
          transactions: [current],
          subtotalOpening: opening,
          subtotalDebit: debit,
          subtotalCredit: credit,
          subtotalClosing: closing,
        });
      }

      // Update grand totals directly
      grandTotals.grandTotalOpening += opening;
      grandTotals.grandTotalDebit += debit;
      grandTotals.grandTotalCredit += credit;
      grandTotals.grandTotalClosing += closing;

      return acc;
    }, []);

    return { groupedData, grandTotals };
  };

  const getTrailBalanceReportApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getTrailBalanceReportAPI(
        orgId,
        item.branch,
        postFromDate,
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
    fromDate,
    toDate,
  };
};
