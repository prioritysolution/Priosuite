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
  getDepositReportDataAPI,
  getDepositReportProductTypeAPI,
  getDepositReportTypeAPI,
  getTransactionDepositReceiptAPI,
} from "./DepositReportApis";
import { getReportTypeData } from "@/container/membership/report/MemberReportReducer";
import { getProductTypeData } from "./DepositReportReducer";
import { useDepositLedger } from "@/common/ledger/depositLedger/Hooks";

export const useDepositReport = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [tableData, setTableData] = useState([]);

  const [depositReceiptData, setDepositReceiptData] = useState([]);
  const [isOpenDepositReceipt, setIsOpenDepositReceipt] = useState(false);

  const [showData, setShowData] = useState("");

  const {
    loading: getLedgerLoading,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalDeposit: totalLedgerDeposit,
    totalWithdrawn: totalLedgerWithdrawn,
    totalInterest: totalLedgerInterest,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getDepositLedgerHeaderApiCall,
    getDepositLedgerDataApiCall,
  } = useDepositLedger();

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
    productType: yup.string().required("Product type is required"),
    reportType: yup.string().required("Report type is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      productType: "",
      reportType: "",
      branch: `${branchId}`,
    },
  });

  const handleSubmit = (values) => {
    getDepositReportDataApiCall(values);
    setShowData(values.reportType);
    setFromDate(values.fromDate);
    setToDate(values.toDate);
  };

  const handleGenerateDepositReceipt = (transId, date) => {
    getTransactionDepositReceiptApiCall(transId, date);
  };

  const handleShowLedger = (id) => {
    if (id) {
      getDepositLedgerHeaderApiCall(id, toDate, fromDate);
      setShowLedgerDialog(true);
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

  const totalDeposit = calculateTotal(tableData, "Deposit");
  const totalWithdrawn = calculateTotal(tableData, "Withdrwan");
  const totalInterest = calculateTotal(tableData, "Interest");

  const totalOpening = calculateTotal(tableData, "Opening");
  const totalClosing = calculateTotal(tableData, "Closing");
  const totalPaidIntt = calculateTotal(tableData, "Paid_Intt");
  const totalDueIntt = calculateTotal(tableData, "Due_Intt");

  const totalAmount = calculateTotal(tableData, "Amount");

  const getDepositReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getDepositReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate,
        item.productType
      );
      if (res.message === "Data Found") {
        if (item.reportType === "106") {
          let grandTotalDeposit = 0;
          let grandTotalWithdrawn = 0;
          let grandTotalInterest = 0;

          // Safeguard against undefined or unexpected res and res.details
          const details = res && Array.isArray(res.details) ? res.details : [];

          const groupedData = details.reduce((acc, current) => {
            const lastGroup = acc[acc.length - 1];

            // Ensure Deposit, Withdrawn, and Interest are numbers (default to 0 if not a valid number)
            const deposit = isNaN(parseFloat(current.Deposit))
              ? 0
              : parseFloat(current.Deposit);
            const withdrawn = isNaN(parseFloat(current.Withdrwan))
              ? 0
              : parseFloat(current.Withdrwan); // Fixed typo: `Withdrwan` to `Withdrawn`
            const interest = isNaN(parseFloat(current.Interest))
              ? 0
              : parseFloat(current.Interest);

            if (
              lastGroup &&
              lastGroup.transactions[0].Trans_Date === current.Trans_Date
            ) {
              lastGroup.transactions.push(current);
              lastGroup.subtotalDeposit += deposit;
              lastGroup.subtotalWithdrawn += withdrawn; // Make sure this line adds up correctly
              lastGroup.subtotalInterest += interest;
            } else {
              acc.push({
                date: current.Trans_Date,
                transactions: [current],
                subtotalDeposit: deposit,
                subtotalWithdrawn: withdrawn, // Make sure withdrawn is initialized here
                subtotalInterest: interest,
              });
            }

            // Add to the grand total for all transactions
            grandTotalDeposit += deposit;
            grandTotalWithdrawn += withdrawn;
            grandTotalInterest += interest;

            return acc;
          }, []);

          // Append grand totals to the grouped data
          groupedData.push({
            isGrandTotal: true,
            grandTotalDeposit,
            grandTotalWithdrawn,
            grandTotalInterest,
          });

          setTableData(groupedData);
        } else {
          setTableData(res.details);
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

  const getDepositReportProductTypeApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getDepositReportProductTypeAPI(orgId);
      console.log(res);
      if (res.message === "Data Found") {
        dispatch(getProductTypeData(res.details));
      } else {
        dispatch(getProductTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getProductTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getDepositReportTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getDepositReportTypeAPI();
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

  const getTransactionDepositReceiptApiCall = async (transId, date) => {
    // setLoading(true);

    try {
      const res = await getTransactionDepositReceiptAPI(orgId, transId, date);
      console.log(res);
      if (res.message === "Data Found") {
        setDepositReceiptData(res.details[0]);
        setIsOpenDepositReceipt(true);
      } else {
        setIsOpenDepositReceipt(false);
        setDepositReceiptData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setIsOpenDepositReceipt(false);
      setDepositReceiptData([]);
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
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    totalOpening,
    totalClosing,
    totalPaidIntt,
    totalDueIntt,
    totalAmount,
    getDepositReportProductTypeApiCall,
    getDepositReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerDeposit,
    totalLedgerWithdrawn,
    totalLedgerInterest,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
    handleGenerateDepositReceipt,
    isOpenDepositReceipt,
    setIsOpenDepositReceipt,
    depositReceiptData,
  };
};
