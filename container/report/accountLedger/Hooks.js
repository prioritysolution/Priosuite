"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getAccountLedgerDataAPI,
  getAccountLedgerReportAPI,
} from "./AccountLedgerApis";
import { getLedgerData } from "./AccountLedgerReducer";
import { getReportVoucherDetailsAPI } from "../daybook/DaybookApis";
import { getVoucherDetailsData } from "../daybook/DaybookReducer";

export const useAccountLedger = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [ledger, setLedger] = useState(null);

  const [showVoucherDetails, setShowVoucherDetails] = useState(false);

  const [totalDrAmount, setTotalDrAmount] = useState(0);
  const [totalCrAmount, setTotalCrAmount] = useState(0);

  const [ledgerTableData, setLedgerTableData] = useState([]);

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    branch: yup.string().required("Branch is required"),
    ledger: yup.string().required("Ledger is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      formDate: null,
      toDate: null,
      branch: branchId,
      ledger: "",
    },
  });

  const handleSubmit = (values) => {
    getAccountLedgerReportApiCall(values);
    setFromDate(format(values.fromDate, "dd-MM-yyyy"));
    setToDate(format(values.toDate, "dd-MM-yyyy"));
    setLedger(values.ledger);
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

  const totalDebit = calculateTotal(ledgerTableData, "Debit");
  const totalCredit = calculateTotal(ledgerTableData, "Credit");

  const getAccountLedgerDataApiCall = async () => {
    setLoading(true);

    try {
      const res = await getAccountLedgerDataAPI(orgId);
      console.log(res);
      if (res.message === "Data Found") {
        dispatch(getLedgerData(res.details));
      } else {
        dispatch(getLedgerData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLedgerData([]));
    } finally {
      setLoading(false);
    }
  };

  const getAccountLedgerReportApiCall = async (item) => {
    setLoading(true);

    const fromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const toDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getAccountLedgerReportAPI(
        orgId,
        item.branch,
        fromDate,
        toDate,
        item.ledger
      );
      console.log(res);
      if (res.message === "Data Found") {
        setLedgerTableData(res.details);
      } else {
        setLedgerTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLedgerTableData([]);
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
    getAccountLedgerDataApiCall,
    ledgerTableData,
    fromDate,
    toDate,
    ledger,
    totalDebit,
    totalCredit,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
  };
};
