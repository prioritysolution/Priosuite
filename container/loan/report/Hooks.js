"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { formatDateForApi } from "@/utils/dateHelpers";
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

  const calculateTotal = (data, ...fields) => {
    return (
      data &&
      data.reduce((total, item) => {
        const raw = fields
          .map((field) => item[field])
          .find((value) => value != null && value !== "");
        const numericValue = raw ? parseFloat(raw) : 0;
        return total + (Number.isNaN(numericValue) ? 0 : numericValue);
      }, 0)
    );
  };

  const totalDisburseAmount = calculateTotal(tableData, "Disb_Amt");
  const totalShareAmount = calculateTotal(tableData, "Share_Amt");
  const totalInsAmount = calculateTotal(tableData, "Ins_Amt");
  const totalMisAmount = calculateTotal(tableData, "Mis_Amt");
  const totalNetDisburse = calculateTotal(tableData, "Net_Disburse");

  const totalPrn = calculateTotal(tableData, "Principal_Paid", "Paid_Prn");
  const totalIntt = calculateTotal(tableData, "Interest_Paid", "Paid_Intt");
  const totalAmount = calculateTotal(tableData, "Tot_Amt");

  const totalOpening = calculateTotal(tableData, "Opening_Balance", "Opening");
  const totalDisburse = calculateTotal(tableData, "Disb_Amt", "Disb");
  const totalCurrOuts = calculateTotal(
    tableData,
    "Current_Principal",
    "Curr_Outs",
  );
  const totalOdOuts = calculateTotal(
    tableData,
    "Overdue_Principal",
    "OD_Outs",
  );
  const totalCurrIntt = calculateTotal(
    tableData,
    "Current_Interest",
    "Curr_Intt",
  );
  const totalOdIntt = calculateTotal(
    tableData,
    "Overdue_Interest",
    "OD_Intt",
  );

  const getLoanReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = formatDateForApi(item.fromDate);
    const postToDate = formatDateForApi(item.toDate);

    try {
      const res = await getLoanReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate,
        item.productType,
      );

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.details)
          ? res.details
          : [];
      const isSuccess =
        res?.success === true ||
        res?.message === "Data Found" ||
        (typeof res?.message === "string" &&
          res.message.toLowerCase().includes("success"));

      if (isSuccess && list.length) {
        if (item.reportType === "111") {
          let grandTotalPrincipal = 0;
          let grandTotalInterest = 0;
          let grandTotalAmount = 0;

          const groupedData = list.reduce((acc, current) => {
            const lastGroup = acc[acc.length - 1];

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
              : parseFloat(current.Tot_Amt);

            if (
              lastGroup &&
              lastGroup.transactions[0].Paid_Date === current.Paid_Date
            ) {
              lastGroup.transactions.push(current);
              lastGroup.subtotalPrincipal += principal;
              lastGroup.subtotalInterest += interest;
              lastGroup.subtotalAmount += amount;
            } else {
              acc.push({
                date: current.Paid_Date,
                transactions: [current],
                subtotalPrincipal: principal,
                subtotalInterest: interest,
                subtotalAmount: amount,
              });
            }

            grandTotalPrincipal += principal;
            grandTotalInterest += interest;
            grandTotalAmount += amount;

            return acc;
          }, []);

          groupedData.push({
            isGrandTotal: true,
            grandTotalPrincipal,
            grandTotalInterest,
            grandTotalAmount,
          });

          setTableData(groupedData);
        } else {
          setTableData(list);
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
