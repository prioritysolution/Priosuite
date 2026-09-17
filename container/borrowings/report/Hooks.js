"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getReportTypeData } from "@/container/membership/report/MemberReportReducer";
import {
  getBorrowingsReportDataAPI,
  getBorrowingsReportTypeAPI,
} from "./BorrowingsReportApis";
import { useBorrowingsLedger } from "@/common/ledger/borrowingsLedger/Hooks";

export const useBorrowingsReport = () => {
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
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getBorrowingsLedgerHeaderApiCall,
    getBorrowingsLedgerDataApiCall,
  } = useBorrowingsLedger();

  const formSchema = yup.object({
    fromDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .required("From date is required"),
    toDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .required("To date is required"),
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
    getBorrowingsReportDataApiCall(values);
    setShowData(values.reportType);
    setFromDate(format(values.fromDate, "yyyy-MM-dd"));
    setToDate(values.toDate);
  };

  const handleShowLedger = (id) => {
    if (id) {
      getBorrowingsLedgerHeaderApiCall(id, toDate, fromDate);
      getBorrowingsLedgerDataApiCall(id, toDate, fromDate);
      setShowLedger(true);
    } else {
      toast.error("Select member and date first");
    }
  };

  const getBorrowingsReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getBorrowingsReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate
      );
      console.log(res);
      if (res.message === "Data Found") {
        let grandTotalDisburse = 0; // Use let
        let grandTotalPrnRefund = 0; // Use let
        let grandTotalInttRefund = 0; // Use let
        let grandTotalOutsBal = 0; // Use let

        const groupedData = res.details.reduce((acc, current) => {
          const groupIndex = acc.findIndex(
            (group) => group.prnGl === current.Prn_Gl
          );

          // Parse numeric values for accurate calculations
          const disburse = parseFloat(current.Disburse) || 0;
          const prnRefund = parseFloat(current.Prn_Refund) || 0;
          const inttRefund = parseFloat(current.Intt_Refund) || 0;
          const outsBal = parseFloat(current.Outs_Bal) || 0;

          if (groupIndex !== -1) {
            // Add to existing group
            const group = acc[groupIndex];
            group.transactions.push(current);
            group.subtotalDisburse += disburse;
            group.subtotalPrnRefund += prnRefund;
            group.subtotalInttRefund += inttRefund;
            group.subtotalOutsBal += outsBal;
          } else {
            // Create a new group
            acc.push({
              prnGl: current.Prn_Gl,
              transactions: [current],
              subtotalDisburse: disburse,
              subtotalPrnRefund: prnRefund,
              subtotalInttRefund: inttRefund,
              subtotalOutsBal: outsBal,
            });
          }

          // Update grand totals
          grandTotalDisburse += disburse;
          grandTotalPrnRefund += prnRefund;
          grandTotalInttRefund += inttRefund;
          grandTotalOutsBal += outsBal;

          return acc;
        }, []);

        groupedData.push({
          isGrandTotal: true,
          grandTotalDisburse,
          grandTotalPrnRefund,
          grandTotalInttRefund,
          grandTotalOutsBal,
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

  const getBorrowingsReportTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getBorrowingsReportTypeAPI();
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
    getBorrowingsReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
  };
};
