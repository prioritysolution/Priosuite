"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCashAccountReportAPI } from "./CashAccountApis";
import {
  getReportVoucherDetailsAPI,
  getReportVoucherListAPI,
} from "../daybook/DaybookApis";
import {
  getVoucherDetailsData,
  getVoucherListData,
} from "../daybook/DaybookReducer";

export const useCashAccount = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [cashBalanceData, setCashBalanceData] = useState(null);
  const [denomData, setDenomData] = useState([]);

  const [showVoucherList, setShowVoucherList] = useState(false);
  const [branch, setBranch] = useState(null);

  const [showVoucherDetails, setShowVoucherDetails] = useState(false);

  const [totalDrAmount, setTotalDrAmount] = useState(0);
  const [totalCrAmount, setTotalCrAmount] = useState(0);

  const [ledgerTableReceiptData, setLedgerTableReceiptData] = useState([]);
  const [ledgerTablePaymentData, setLedgerTablePaymentData] = useState([]);

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
      branch: branchId?.toString(),
    },
  });

  const handleSubmit = (values) => {
    getCashAccountReportApiCall(values);
    setFromDate(format(values.fromDate, "dd-MM-yyyy"));
    setToDate(format(values.toDate, "dd-MM-yyyy"));
    setBranch(values.branch);
  };

  const handleShowVoucherList = (mode, ledgerId) => {
    getReportVoucherListApiCall(mode, ledgerId);
    setShowVoucherList(true);
  };

  const handleShowVoucherDetails = (txnId) => {
    if (orgId && txnId) {
      getReportVoucherDetailsApiCall(orgId, txnId);
      setShowVoucherDetails(true);
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

  const totalCashReceived = calculateTotal(ledgerTableReceiptData, "Cash");
  const totalTranferReceived = calculateTotal(
    ledgerTableReceiptData,
    "Transfer"
  );
  const totalReceived = calculateTotal(ledgerTableReceiptData, "Total");

  const totalCashPayment = calculateTotal(ledgerTablePaymentData, "Cash");
  const totalTranferPayment = calculateTotal(
    ledgerTablePaymentData,
    "Transfer"
  );
  const totalPayment = calculateTotal(ledgerTablePaymentData, "Total");

  const getCashAccountReportApiCall = async (item) => {
    setLoading(true);

    const fromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const toDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getCashAccountReportAPI(
        orgId,
        item.branch,
        fromDate,
        toDate
      );
      console.log(res);
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
    setLoading(true);

    const parsedFromDate =
      fromDate && parse(fromDate, "dd-MM-yyyy", new Date());
    const parsedToDate = toDate && parse(toDate, "dd-MM-yyyy", new Date());

    const postFromDate = parsedFromDate && format(parsedFromDate, "yyyy-MM-dd");
    const postToDate = parsedToDate && format(parsedToDate, "yyyy-MM-dd");

    try {
      const res = await getReportVoucherListAPI(
        orgId,
        branch,
        postFromDate,
        postToDate,
        mode,
        ledgerId
      );

      if (res.message === "Data Found") {
        dispatch(getVoucherListData(res.data?.data));
      } else {
        dispatch(getVoucherListData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getVoucherListData([]));
    } finally {
      setLoading(false);
    }
  };

  const getReportVoucherDetailsApiCall = async (orgId, txnId) => {
    setLoading(true);

    try {
      const res = await getReportVoucherDetailsAPI(orgId, txnId);

      if (res.message === "Data Found") {
        dispatch(getVoucherDetailsData(res.details));

        let newTotalDrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "D"),
          "Amount"
        );
        let newTotalCrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "C"),
          "Amount"
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
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    ledgerTableReceiptData,
    ledgerTablePaymentData,
    // generatePDF,
    fromDate,
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
    denomData,
  };
};
