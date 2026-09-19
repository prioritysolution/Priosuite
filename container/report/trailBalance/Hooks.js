"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getTrailBalanceReportAPI } from "./TrailBalanceApis";
import { localNoon, parseLocalDate } from "@/utils/dateHelpers";



export const useTrailBalance = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [ledgerLiablitiesTableData, setLedgerLiablitiesTableData] = useState({
    groupedData: [],
    grandTotals: null,
  });
  const [ledgerAssetsTableData, setLedgerAssetsTableData] = useState({
    groupedData: [],
    grandTotals: null,
  });

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      branch: branchId,
    },
  });

  console.log(getCookieData("fin_start_date"));
  console.log(getCookieData("fin_end_date"));
  
 
  

  useEffect(() => {
   
    const from = new Date(getCookieData("fin_start_date"));
    const to = new Date(getCookieData("fin_end_date"));
    form.reset({
      fromDate: new Date(getCookieData("fin_start_date")),
      toDate: new Date(getCookieData("fin_end_date")),
      branch: form.getValues("branch") || getCookieData("userBranchId"),
    });
  }, [form]);

  const handleSubmit = (values) => {
    getTrailBalanceReportApiCall(values);
    setFromDate(format(values.fromDate, "dd-MM-yyyy"));
    setToDate(format(values.toDate, "dd-MM-yyyy"));
  };

  const groupDataByMainAndHead = (details) => {
    const grandTotals = {
      grandTotalOpening: 0,
      grandTotalDebit: 0,
      grandTotalCredit: 0,
      grandTotalClosing: 0,
    };

    const groupedData = details.reduce((acc, current) => {
      const opening = parseFloat(current.Opening) || 0;
      const debit = parseFloat(current.Debit) || 0;
      const credit = parseFloat(current.Credit) || 0;
      const closing = parseFloat(current.Closing) || 0;

      let mainGroup = acc.find((group) => group.mainHead === current.Main_Head);

      if (!mainGroup) {
        mainGroup = {
          mainHead: current.Main_Head,
          mainName: current.Main_Name,
          heads: [],
          subtotalOpening: 0,
          subtotalDebit: 0,
          subtotalCredit: 0,
          subtotalClosing: 0,
        };
        acc.push(mainGroup);
      }

      let headGroup = mainGroup.heads.find(
        (group) => group.headId === current.Head_Id,
      );

      if (!headGroup) {
        headGroup = {
          headId: current.Head_Id,
          headName: current.Head_Name,
          transactions: [],
          subtotalOpening: 0,
          subtotalDebit: 0,
          subtotalCredit: 0,
          subtotalClosing: 0,
        };
        mainGroup.heads.push(headGroup);
      }

      headGroup.transactions.push(current);
      headGroup.subtotalOpening += opening;
      headGroup.subtotalDebit += debit;
      headGroup.subtotalCredit += credit;
      headGroup.subtotalClosing += closing;

      mainGroup.subtotalOpening += opening;
      mainGroup.subtotalDebit += debit;
      mainGroup.subtotalCredit += credit;
      mainGroup.subtotalClosing += closing;

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

        setLedgerAssetsTableData(groupDataByMainAndHead(newAssetData));
        setLedgerLiablitiesTableData(groupDataByMainAndHead(newLiablitiesData));
      } else {
        setLedgerAssetsTableData({ groupedData: [], grandTotals: null });
        setLedgerLiablitiesTableData({ groupedData: [], grandTotals: null });
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLedgerAssetsTableData({ groupedData: [], grandTotals: null });
      setLedgerLiablitiesTableData({ groupedData: [], grandTotals: null });
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
