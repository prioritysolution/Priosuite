"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getDaybookReportAPI,
  getReportVoucherDetailsAPI,
  getReportVoucherListAPI,
} from "./DaybookApis";
import { useDispatch } from "react-redux";
import { getVoucherDetailsData, getVoucherListData } from "./DaybookReducer";

export const useDaybook = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [getVoucherListLoading, setGetVoucherListLoading] = useState(false);
  const [getVoucherDetailsLoading, setGetVoucherDetailsLoading] =
    useState(false);

  const [cashBalanceData, setCashBalanceData] = useState(null);

  const [showVoucherList, setShowVoucherList] = useState(false);
  const [branch, setBranch] = useState(null);

  const [showVoucherDetails, setShowVoucherDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPagePage] = useState(1);

  const [totalDrAmount, setTotalDrAmount] = useState(0);
  const [totalCrAmount, setTotalCrAmount] = useState(0);

  const [activeMode, setActiveMode] = useState(0);
  const [activeLedgerId, setActiveLedgerId] = useState(0);

  const formSchema = yup.object({
    date: yup.date().required("Date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: new Date(),
      branch: branchId?.toString(),
    },
  });

  const handleSubmit = (values) => {
    getReceivedDaybookReportApiCall(values);
    setToDate(format(values.date, "dd-MM-yyyy"));
    setBranch(values.branch);
  };

  const handleShowVoucherList = (mode, ledgerId) => {
    setActiveMode(mode);
    setActiveLedgerId(ledgerId);
    setCurrentPage(1);
    setShowVoucherList(true);
  };

  const handleShowVoucherDetails = (txnId) => {
    if (orgId && txnId) {
      getReportVoucherDetailsApiCall(orgId, txnId);
      setShowVoucherDetails(true);
    }
  };

  const [ledgerTableReceiptData, setLedgerTableReceiptData] = useState([]);
  const [ledgerTablePaymentData, setLedgerTablePaymentData] = useState([]);
  const [denomData, setDenomData] = useState([]);

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

  const totalCashReceived = calculateTotal(ledgerTableReceiptData, "Cash");
  const totalTranferReceived = calculateTotal(
    ledgerTableReceiptData,
    "Transfer",
  );
  const totalReceived = calculateTotal(ledgerTableReceiptData, "Total");

  const totalCashPayment = calculateTotal(ledgerTablePaymentData, "Cash");
  const totalTranferPayment = calculateTotal(
    ledgerTablePaymentData,
    "Transfer",
  );
  const totalPayment = calculateTotal(ledgerTablePaymentData, "Total");

  const getReceivedDaybookReportApiCall = async (item) => {
    setLoading(true);

    try {
      const res = await getDaybookReportAPI(
        orgId,
        item.branch,
        format(item.date, "yyyy-MM-dd"),
      );
      if (res.message === "Data Found") {
        setLedgerTableReceiptData(res.details[0]?.Receipt_Data);
        setLedgerTablePaymentData(res.details[0]?.Payment_Data);
        setCashBalanceData({
          Opening: res.details[0].Opening_Cash,
          Closing: res.details[0].Closing_Cash,
        });
        setDenomData(res.details[0]?.Denom_Data);
      } else {
        setLedgerTableReceiptData([]);
        setLedgerTablePaymentData([]);
        setCashBalanceData(null);
        setDenomData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLedgerTableReceiptData([]);
      setLedgerTablePaymentData([]);
      setCashBalanceData(null);
      setDenomData([]);
    } finally {
      setLoading(false);
    }
  };

  const getReportVoucherListApiCall = async (mode, ledgerId) => {
    setGetVoucherListLoading(true);

    const parsedDate = toDate && parse(toDate, "dd-MM-yyyy", new Date());

    const postFromDate = parsedDate && format(parsedDate, "yyyy-MM-dd");
    const postToDate = parsedDate && format(parsedDate, "yyyy-MM-dd");

    try {
      const res = await getReportVoucherListAPI(
        orgId,
        branch,
        postFromDate,
        postToDate,
        mode,
        ledgerId,
        currentPage,
      );

      if (res.message === "Data Found") {
        dispatch(getVoucherListData(res.data?.data));
        setLastPagePage(res.data?.last_page);
      } else {
        dispatch(getVoucherListData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getVoucherListData([]));
    } finally {
      setGetVoucherListLoading(false);
    }
  };

  const getReportVoucherDetailsApiCall = async (orgId, txnId) => {
    setGetVoucherDetailsLoading(true);

    try {
      const res = await getReportVoucherDetailsAPI(orgId, txnId);

      if (res.message === "Data Found") {
        dispatch(getVoucherDetailsData(res.details));

        let newTotalDrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "D"),
          "Amount",
        );
        let newTotalCrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "C"),
          "Amount",
        );

        setTotalDrAmount(newTotalDrAmount);
        setTotalCrAmount(newTotalCrAmount);
      } else {
        dispatch(getVoucherDetailsData([]));
        setTotalDrAmount(0);
        setTotalCrAmount(0);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getVoucherDetailsData([]));
      setTotalDrAmount(0);
      setTotalCrAmount(0);
    } finally {
      setGetVoucherDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (activeMode && activeLedgerId && currentPage) {
      getReportVoucherListApiCall(activeMode, activeLedgerId);
    }
  }, [currentPage, activeMode, activeLedgerId]);

  useEffect(() => {
    if (!showVoucherList) {
      dispatch(getVoucherListData([]));
      setActiveMode(0);
      setActiveLedgerId(0);
    }
  }, [showVoucherList, dispatch]);

  useEffect(() => {
    if (!showVoucherDetails) {
      dispatch(getVoucherDetailsData([]));
      setTotalDrAmount(0);
      setTotalCrAmount(0);
    }
  }, [showVoucherDetails, dispatch]);

  return {
    loading,
    getVoucherListLoading,
    getVoucherDetailsLoading,
    form,
    handleSubmit,
    ledgerTableReceiptData,
    ledgerTablePaymentData,
    denomData,
    // generatePDF,
    toDate,
    totalCashReceived,
    totalTranferReceived,
    totalReceived,
    totalCashPayment,
    totalTranferPayment,
    totalPayment,
    cashBalanceData,
    showVoucherList,
    setShowVoucherList,
    handleShowVoucherList,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    currentPage,
    setCurrentPage,
    lastPage,
  };
};
