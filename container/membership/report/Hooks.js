"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  getMemberReportDataAPI,
  getMembershipReportTypeAPI,
  getTransactionShareReceiptAPI,
} from "./MemberReportApis";
import { getReportTypeData } from "./MemberReportReducer";
import { useShareLedger } from "@/common/ledger/shareLedger/Hooks";

export const useMemberReport = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [tableData, setTableData] = useState([]);

  const [shareIssueReceiptData, setShareIssueReceiptData] = useState([]);
  const [isOpenShareReceipt, setIsOpenShareReceipt] = useState(false);

  const [showData, setShowData] = useState("");

  const {
    loading: getLedgerLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalIssue: totalLedgerIssue,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getShareLedgerHeaderApiCall,
    getShareLedgerDataApiCall,
  } = useShareLedger();

  const formSchema = yup.object({
    fromDate: yup
      .date()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .typeError("Invalid date")
      .required("From date is required"),
    toDate: yup
      .date()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .typeError("Invalid date")
      .required("To date is required"),
    memberType: yup.string().required("Member type is required"),
    reportType: yup.string().required("Report type is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      memberType: "",
      reportType: "",
      branch: branchId,
    },
  });

  const handleSubmit = (values) => {
    getMemberReportDataApiCall(values);
    setShowData(values.reportType);
    setFromDate(values.fromDate);
    setToDate(values.toDate);
  };

  const handleGenerateShareReceipt = (transId, date) => {
    getTransactionShareReceiptApiCall(transId, date);
  };

  const handleShowLedger = (id) => {
    if (id) {
      getShareLedgerHeaderApiCall(id, toDate, fromDate);
      setShowLedger(true);
    } else {
      toast.error("Select member and date first");
    }
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

  const totalAdmFees = calculateTotal(tableData, "Adm_Fees");

  const totalIssue = calculateTotal(tableData, "Tot_Issue");
  const totalRelease = calculateTotal(tableData, "Tot_Release");

  const totalAmount = calculateTotal(tableData, "Amount");

  const totalOpening = calculateTotal(tableData, "Opening");
  const totalClosing = calculateTotal(tableData, "Closing");
  const totalDividend = calculateTotal(tableData, "Divid_Bal");

  const totalBalance = calculateTotal(tableData, "Balance");

  const getMemberReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getMemberReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate,
        item.memberType
      );
      if (res.message === "Data Found") {
        if (item.reportType === "101") {
          let grandTotalIssue = 0;
          let grandTotalRelease = 0;

          // Safeguard against undefined or unexpected res and res.details
          const details = res && Array.isArray(res.details) ? res.details : [];

          const groupedData = details
            .map((item) => ({
              ...item,
              Tot_Issue:
                item.Trans_Type === "I" ? parseFloat(item.Tot_Amt || 0) : 0,
              Tot_Release:
                item.Trans_Type === "R" ? parseFloat(item.Tot_Amt || 0) : 0,
            }))
            .reduce((acc, current) => {
              const lastGroup = acc[acc.length - 1];

              if (
                lastGroup &&
                lastGroup.transactions[0].Trans_Date === current.Trans_Date
              ) {
                lastGroup.transactions.push(current);
                lastGroup.subtotalIssue += current.Tot_Issue;
                lastGroup.subtotalRelease += current.Tot_Release;
              } else {
                acc.push({
                  date: current.Trans_Date,
                  transactions: [current],
                  subtotalIssue: current.Tot_Issue,
                  subtotalRelease: current.Tot_Release,
                });
              }

              grandTotalIssue += current.Tot_Issue;
              grandTotalRelease += current.Tot_Release;

              return acc;
            }, []);

          // Append grand totals to the grouped data
          groupedData.push({
            isGrandTotal: true,
            grandTotalIssue,
            grandTotalRelease,
          });

          setTableData(groupedData);
        } else {
          setTableData(res && Array.isArray(res.details) ? res.details : []);
        }
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

  const getMemberReportTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getMembershipReportTypeAPI();
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

  const getTransactionShareReceiptApiCall = async (transId, date) => {
    // setLoading(true);

    try {
      const res = await getTransactionShareReceiptAPI(orgId, transId, date);
      console.log(res);
      if (res.message === "Data Found") {
        setShareIssueReceiptData(res.details[0]);
        setIsOpenShareReceipt(true);
      } else {
        setIsOpenShareReceipt(false);
        setShareIssueReceiptData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setIsOpenShareReceipt(false);
      setShareIssueReceiptData([]);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  return {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    totalAdmFees,
    totalIssue,
    totalRelease,
    totalAmount,
    totalOpening,
    totalClosing,
    totalDividend,
    totalBalance,
    getMemberReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalLedgerIssue,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
    handleGenerateShareReceipt,
    isOpenShareReceipt,
    setIsOpenShareReceipt,
    shareIssueReceiptData,
  };
};
