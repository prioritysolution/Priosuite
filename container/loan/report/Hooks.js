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
import { getLoanProductList } from "./LoanReportReducer";
import {
  getLoanRepaymentCollectionReceiptAPI,
  getLoanReportDataAPI,
  getLoanReportTypeAPI,
  LoanGetProductAPI,
} from "./LoanReportApis";
import { useLoanLedger } from "@/common/ledger/loanLedger/Hooks";

export const useLoanReport = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  // console.log("tocken= ", getCookieData("prioBankClientToken"));

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [collectionReceiptData, setCollectionReceiptData] = useState([]);
  const [isOpenCollectionReceipt, setIsOpenCollectionReceipt] = useState(false);

  const [showData, setShowData] = useState("");

  const {
    loading: getLedgerLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse: totalLedgerDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getLoanLedgerHeaderApiCall,
    getLoanLedgerDataApiCall,
  } = useLoanLedger();

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
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
    getLoanReportDataApiCall(values);
    setShowData(values.reportType);
    setFromDate(values.fromDate);
    setToDate(values.toDate);
  };

  const handleGenerateCollectionReceipt = (transId) => {
    getLoanRepaymentCollectionReceiptApiCall(transId);
  };

  const handleShowLedger = (id) => {
    if (id) {
      getLoanLedgerHeaderApiCall(id, toDate, fromDate);
      getLoanLedgerDataApiCall(id, toDate, fromDate);
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

  const totalDisburseAmount = calculateTotal(tableData, "Disb_Amt");
  const totalShareAmount = calculateTotal(tableData, "Share_Amt");
  const totalInsAmount = calculateTotal(tableData, "Ins_Amt");
  const totalMisAmount = calculateTotal(tableData, "Mis_Amt");
  const totalNetDisburse = calculateTotal(tableData, "Net_Disburse");

  const totalPrn = calculateTotal(tableData, "Paid_Prn");
  const totalIntt = calculateTotal(tableData, "Paid_Intt");
  const totalAmount = calculateTotal(tableData, "Tot_Amt");

  const totalOpening = calculateTotal(tableData, "Opening");
  const totalDisburse = calculateTotal(tableData, "Disb");
  const totalCurrOuts = calculateTotal(tableData, "Curr_Outs");
  const totalOdOuts = calculateTotal(tableData, "OD_Outs");
  const totalCurrIntt = calculateTotal(tableData, "Curr_Intt");
  const totalOdIntt = calculateTotal(tableData, "OD_Intt");

  const getLoanReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getLoanReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate,
        item.productType,
      );

      if (res.message === "Data Found") {
        if (item.reportType === "111") {
          let grandTotalPrincipal = 0;
          let grandTotalInterest = 0;
          let grandTotalAmount = 0;

          // Safeguard against undefined or unexpected res and res.details
          const details = res && Array.isArray(res.details) ? res.details : [];

          const groupedData = details.reduce((acc, current) => {
            const lastGroup = acc[acc.length - 1];

            // Ensure Deposit, Withdrawn, and Interest are numbers (default to 0 if not a valid number)
            const principal = isNaN(parseFloat(current.Paid_Prn))
              ? 0
              : parseFloat(current.Paid_Prn);
            const interest = isNaN(
              parseFloat(current.Interest || current.Paid_Intt),
            )
              ? 0
              : parseFloat(current.Interest || current.Paid_Intt);
            const amount = isNaN(parseFloat(current.Tot_Amt))
              ? 0
              : parseFloat(current.Tot_Amt); // Fixed typo: `Withdrwan` to `Withdrawn`

            if (
              lastGroup &&
              lastGroup.transactions[0].Paid_Date === current.Paid_Date
            ) {
              lastGroup.transactions.push(current);
              lastGroup.subtotalPrincipal += principal;
              lastGroup.subtotalInterest += interest;
              lastGroup.subtotalAmount += amount; // Make sure this line adds up correctly
            } else {
              acc.push({
                date: current.Paid_Date,
                transactions: [current],
                subtotalPrincipal: principal,
                subtotalInterest: interest,
                subtotalAmount: amount, // Make sure withdrawn is initialized here
              });
            }

            // Add to the grand total for all transactions
            grandTotalPrincipal += principal;
            grandTotalInterest += interest;
            grandTotalAmount += amount;

            return acc;
          }, []);

          // Append grand totals to the grouped data
          groupedData.push({
            isGrandTotal: true,
            grandTotalPrincipal,
            grandTotalInterest,
            grandTotalAmount,
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

  const getLoanReportTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getLoanReportTypeAPI();
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

  const getLoanRepaymentCollectionReceiptApiCall = async (transId) => {
    // setLoading(true);

    try {
      const res = await getLoanRepaymentCollectionReceiptAPI(orgId, transId);
      console.log(res);
      if (res.message === "Data Found") {
        setCollectionReceiptData(res.details[0]);
        setIsOpenCollectionReceipt(true);
      } else {
        setIsOpenCollectionReceipt(false);
        setCollectionReceiptData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setIsOpenCollectionReceipt(false);
      setCollectionReceiptData([]);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const getLoanProductListApiCall = async (org_id) => {
    setLoading(true);

    try {
      const res = await LoanGetProductAPI(org_id);

      if (res.message === "Data Found") {
        dispatch(getLoanProductList(res.details));
      } else {
        dispatch(getLoanProductList([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLoanProductList([]));
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
    totalDisburseAmount,
    totalShareAmount,
    totalInsAmount,
    totalMisAmount,
    totalNetDisburse,
    totalOpening,
    totalDisburse,
    totalPrn,
    totalIntt,
    totalAmount,
    totalCurrOuts,
    totalOdOuts,
    totalCurrIntt,
    totalOdIntt,
    getLoanReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
    handleGenerateCollectionReceipt,
    isOpenCollectionReceipt,
    setIsOpenCollectionReceipt,
    collectionReceiptData,
    getLoanProductListApiCall,
  };
};
