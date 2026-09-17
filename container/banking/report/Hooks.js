"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useBankLedger } from "@/common/ledger/bankLedger/Hooks";
import {
  getBankReportDataAPI,
  getBankReportTypeAPI,
} from "./BankingReportApis";
import { getReportTypeData } from "@/container/membership/report/MemberReportReducer";

export const useBankReport = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [tableData, setTableData] = useState([]);

  const [showData, setShowData] = useState("");

  const {
    loading: getLedgerLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn: totalLedgerWithdrawn,
    totalDeposit: totalLedgerDeposit,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getBankLedgerHeaderApiCall,
    getBankLedgerDataApiCall,
  } = useBankLedger();

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    reportType: yup.string().required("Report type is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      reportType: "",
      branch: branchId,
    },
  });

  const handleSubmit = (values) => {
    getBankReportDataApiCall(values);
    setShowData(values.reportType);
    setFromDate(format(values.fromDate, "yyyy-MM-dd"));
    setToDate(values.toDate);
  };

  const handleShowLedger = (id) => {
    if (id) {
      getBankLedgerHeaderApiCall(id, toDate, fromDate);
      getBankLedgerDataApiCall(id, toDate, fromDate);
      setShowLedger(true);
    } else {
      toast.error("Select member and date first");
    }
  };

  const getBankReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getBankReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate
      );
      console.log(res);
      if (res.message === "Data Found") {
        let grandTotalOpening = 0; // Use let
        let grandTotalDeposit = 0; // Use let
        let grandTotalWithdrawn = 0; // Use let
        let grandTotalClosing = 0; // Use let

        const groupedData = res.details.reduce((acc, current) => {
          const groupIndex = acc.findIndex(
            (group) => group.underGl === current.Under_Gl
          );

          // Parse numeric values for accurate calculations
          const opening = parseFloat(current.Opening) || 0;
          const deposit = parseFloat(current.Deposit) || 0;
          const withdrawn = parseFloat(current.Withdrawn) || 0;
          const closing = parseFloat(current.Closing) || 0;

          if (groupIndex !== -1) {
            // Add to existing group
            const group = acc[groupIndex];
            group.transactions.push(current);
            group.subtotalOpening += opening;
            group.subtotalDeposit += deposit;
            group.subtotalWithdrawn += withdrawn;
            group.subtotalClosing += closing;
          } else {
            // Create a new group
            acc.push({
              underGl: current.Under_Gl,
              transactions: [current],
              subtotalOpening: opening,
              subtotalDeposit: deposit,
              subtotalWithdrawn: withdrawn,
              subtotalClosing: closing,
            });
          }

          // Update grand totals
          grandTotalOpening += opening;
          grandTotalDeposit += deposit;
          grandTotalWithdrawn += withdrawn;
          grandTotalClosing += closing;

          return acc;
        }, []);

        groupedData.push({
          isGrandTotal: true,
          grandTotalOpening,
          grandTotalDeposit,
          grandTotalWithdrawn,
          grandTotalClosing,
        });

        // Set tableData for rendering
        setTableData(groupedData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const getBankReportTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getBankReportTypeAPI();
      console.log(res);
      if (res.message === "Data Found") {
        dispatch(getReportTypeData(res.details));
      } else {
        dispatch(getReportTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getReportTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    getBankReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerWithdrawn,
    totalLedgerDeposit,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
  };
};
